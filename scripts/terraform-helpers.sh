#!/bin/bash

# Helper function to check if a resource exists
resource_exists() {
  local check_command=$1
  if eval "$check_command" > /dev/null 2>&1; then
    return 0  # Resource exists
  else
    return 1  # Resource doesn't exist
  fi
}

# Helper function to import or create resources
import_or_create() {
  local resource_type=$1
  local check_command=$2
  local import_command=$3
  
  echo "🔍 Checking ${resource_type}..."
  if resource_exists "$check_command"; then
    echo "📥 ${resource_type} exists, importing to Terraform..."
    eval "$import_command" || echo "⚠️ Import failed - resource may already be in state"
  else
    echo "✨ ${resource_type} doesn't exist, will be created by Terraform"
  fi
}

# Function to wait for IAM role propagation
wait_for_role() {
  local role_name=$1
  local max_attempts=12
  local attempt=1
  local wait_time=5

  echo "⏳ Waiting for IAM role propagation..."
  while ! aws iam get-role --role-name "$role_name" >/dev/null 2>&1; do
    if [ $attempt -ge $max_attempts ]; then
      echo "❌ Timeout waiting for role propagation"
      return 1
    fi
    echo "Attempt $attempt of $max_attempts - waiting ${wait_time}s..."
    sleep $wait_time
    ((attempt++))
  done
  echo "✅ Role propagated successfully"
}

# Main function to import AWS resources
import_aws_resources() {
  # Debug Lambda function state
  echo "🔍 Checking Lambda function state..."
  LAMBDA_NAME="acidizer-${ENV}-backend"
  
  if LAMBDA_INFO=$(aws lambda get-function --function-name $LAMBDA_NAME 2>&1); then
    echo "✅ Lambda function exists:"
    echo "$LAMBDA_INFO"
    
    if ! terraform state list | grep -q "module.lambda.aws_lambda_function.backend"; then
      echo "📥 Importing Lambda function..."
      terraform import module.lambda.aws_lambda_function.backend $LAMBDA_NAME
    fi
  else
    echo "✨ Lambda function will be created by Terraform"
  fi

  # Import AWS resources
  import_or_create \
    "ECR Repository" \
    "aws ecr describe-repositories --repository-names vc0-acidizer-${ENV}-backend" \
    "terraform import aws_ecr_repository.backend vc0-acidizer-${ENV}-backend"

  import_or_create \
    "DynamoDB Table" \
    "aws dynamodb describe-table --table-name acidizer-${ENV}-counter" \
    "terraform import aws_dynamodb_table.counter acidizer-${ENV}-counter"

  import_or_create \
    "IAM Role" \
    "aws iam get-role --role-name acidizer-${ENV}-lambda-role" \
    "terraform import aws_iam_role.lambda_role acidizer-${ENV}-lambda-role"

  import_or_create \
    "S3 Bucket" \
    "aws s3api head-bucket --bucket vc0-acidizer-${ENV}-frontend" \
    "terraform import module.frontend.aws_s3_bucket.frontend vc0-acidizer-${ENV}-frontend"

  import_or_create \
    "API Gateway Log Group" \
    "aws logs describe-log-groups --log-group-name-prefix /aws/apigateway/acidizer-${ENV}" \
    "terraform import module.monitoring.aws_cloudwatch_log_group.api_logs /aws/apigateway/acidizer-${ENV}"

  import_or_create \
    "Lambda Log Group" \
    "aws logs describe-log-groups --log-group-name-prefix /aws/lambda/acidizer-${ENV}-backend" \
    "terraform import module.monitoring.aws_cloudwatch_log_group.lambda_logs /aws/lambda/acidizer-${ENV}-backend"

  # Handle API Gateway resources
  echo "🔧 Setting up API Gateway resources..."
  REST_API_ID=$(aws apigateway get-rest-apis --query "items[?name=='acidizer-${ENV}-api'].id" --output text)
  
  if [ ! -z "$REST_API_ID" ]; then
    echo "Found existing API Gateway with ID: $REST_API_ID"
    
    if aws apigateway get-stage --rest-api-id $REST_API_ID --stage-name ${ENV} >/dev/null 2>&1; then
      echo "Stage ${ENV} exists, importing..."
      terraform import module.api.aws_api_gateway_stage.api ${REST_API_ID}/${ENV} || true
      
      USAGE_PLAN_ID=$(aws apigateway get-usage-plans --query "items[?name=='acidizer-${ENV}-usage-plan'].id" --output text)
      if [ ! -z "$USAGE_PLAN_ID" ]; then
        echo "Importing usage plan..."
        terraform import module.api.aws_api_gateway_usage_plan.api_plan $USAGE_PLAN_ID || true
      fi
    fi
  fi

  # Set up CloudWatch Logs role for API Gateway
  if ! aws apigateway get-account 2>/dev/null | grep -q "cloudwatchRoleArn"; then
    echo "🔧 Setting up CloudWatch Logs role for API Gateway..."
    ROLE_NAME="api-gateway-cloudwatch-logs"
    
    if ! aws iam get-role --role-name $ROLE_NAME 2>/dev/null; then
      aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document '{
          "Version":"2012-10-17",
          "Statement":[{
            "Effect":"Allow",
            "Principal":{"Service":"apigateway.amazonaws.com"},
            "Action":"sts:AssumeRole"
          }]
        }'
      
      aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs
      
      wait_for_role $ROLE_NAME
    fi
    
    aws apigateway update-account \
      --patch-operations op='replace',path='/cloudwatchRoleArn',value="arn:aws:iam::${ACCOUNT_ID}:role/api-gateway-cloudwatch-logs" || true
  fi
} 