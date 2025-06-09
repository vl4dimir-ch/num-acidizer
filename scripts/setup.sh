#!/bin/bash

# Setup script for Number Acidizer infrastructure
# This script creates and imports the required AWS resources for the project

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENV=${TF_VAR_environment:-dev}
REGION=${AWS_REGION:-us-east-1}

# Print usage information
usage() {
    echo "Usage: $0 [-e environment] [-r region]"
    echo "  -e    Environment (dev/staging/prod) [default: dev]"
    echo "  -r    AWS Region [default: us-east-1]"
    echo "  -h    Show this help message"
    exit 1
}

# Parse command line arguments
while getopts "e:r:h" opt; do
    case $opt in
        e) ENV="$OPTARG";;
        r) REGION="$OPTARG";;
        h) usage;;
        \?) usage;;
    esac
done

# Validate environment
if [[ ! "$ENV" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Environment must be dev, staging, or prod${NC}"
    exit 1
fi

# Check AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    exit 1
fi

echo -e "${YELLOW}Setting up infrastructure for environment: ${ENV}${NC}"
echo -e "${YELLOW}Using AWS region: ${REGION}${NC}"

# Function to create resources with better error handling
create_resource() {
    local command="$1"
    local resource_name="$2"
    local error_message="$3"
    
    echo -e "\nCreating $resource_name..."
    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✓ Created $resource_name${NC}"
    else
        if [[ $? -eq 254 ]]; then
            echo -e "${YELLOW}⚠ $resource_name already exists${NC}"
        else
            echo -e "${RED}✗ Failed to create $resource_name${NC}"
            echo -e "${RED}Error: $error_message${NC}"
            exit 1
        fi
    fi
}

# Create ECR Repository
create_resource \
    "aws ecr create-repository --repository-name acidizer-$ENV-backend --region $REGION" \
    "ECR Repository" \
    "Failed to create ECR repository. Check your permissions."

# Create DynamoDB Table
create_resource \
    "aws dynamodb create-table \
        --table-name acidizer-$ENV-counter \
        --attribute-definitions AttributeName=id,AttributeType=S \
        --key-schema AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region $REGION" \
    "DynamoDB Table" \
    "Failed to create DynamoDB table. Check your permissions."

# Create IAM Role
create_resource \
    "aws iam create-role \
        --role-name acidizer-$ENV-lambda-role \
        --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}'" \
    "IAM Role" \
    "Failed to create IAM role. Check your permissions."

# Create IAM Policy
echo -e "\nAttaching policy to IAM role..."
aws iam put-role-policy \
    --role-name acidizer-$ENV-lambda-role \
    --policy-name acidizer-$ENV-lambda-policy \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "arn:aws:logs:*:*:*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem"
                ],
                "Resource": "arn:aws:dynamodb:'$REGION':*:table/acidizer-'$ENV'-counter"
            }
        ]
    }' && echo -e "${GREEN}✓ Attached IAM policy${NC}" || \
    (echo -e "${RED}✗ Failed to attach IAM policy${NC}" && exit 1)

# Function to import resources into Terraform state
import_resource() {
    local command="$1"
    local resource_name="$2"
    
    echo -e "\nImporting $resource_name into Terraform state..."
    if eval "cd ../infrastructure && $command" &> /dev/null; then
        echo -e "${GREEN}✓ Imported $resource_name${NC}"
    else
        echo -e "${YELLOW}⚠ Failed to import $resource_name (might already be in state)${NC}"
    fi
}

# Import resources into Terraform state
import_resource \
    "terraform import aws_ecr_repository.backend acidizer-$ENV-backend" \
    "ECR Repository"

import_resource \
    "terraform import aws_dynamodb_table.counter acidizer-$ENV-counter" \
    "DynamoDB Table"

import_resource \
    "terraform import aws_iam_role.lambda_role acidizer-$ENV-lambda-role" \
    "IAM Role"

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "Next steps:"
echo -e "1. Build and push your Lambda container image to ECR"
echo -e "2. Run terraform init in the infrastructure directory"
echo -e "3. Run terraform plan/apply with your Lambda image URI" 