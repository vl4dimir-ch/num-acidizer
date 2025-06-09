terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# ECR Repository
resource "aws_ecr_repository" "backend" {
  name = "vc0-acidizer-${var.environment}-backend"
  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

# DynamoDB Table
resource "aws_dynamodb_table" "counter" {
  name           = "acidizer-${var.environment}-counter"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "acidizer-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

# IAM policy for DynamoDB access
resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "acidizer-${var.environment}-lambda-dynamodb-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.counter.arn
      }
    ]
  })
}

# IAM policy for CloudWatch Logs
resource "aws_iam_role_policy" "lambda_logs_policy" {
  name = "acidizer-${var.environment}-lambda-logs-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Lambda module
module "lambda" {
  source = "./modules/lambda"

  name              = local.name
  lambda_image_uri  = var.lambda_image_uri
  timeout          = var.lambda_timeout
  memory_size      = var.lambda_memory_size
  lambda_role_arn  = aws_iam_role.lambda_role.arn
  dynamodb_table_name = aws_dynamodb_table.counter.name
  tags             = local.common_tags
}

# API Gateway module
module "api" {
  source = "./modules/api"

  name              = local.name
  environment       = var.environment
  lambda_invoke_arn = module.lambda.invoke_arn
  rate_limit        = var.api_rate_limit
  burst_limit       = var.api_burst_limit
  tags              = local.common_tags
}

# Frontend module
module "frontend" {
  source = "./modules/frontend"

  name = local.name
  tags = local.common_tags
}

# Monitoring module
module "monitoring" {
  source = "./modules/monitoring"

  name                 = local.name
  api_name             = "${local.name}-api"
  lambda_function_name = module.lambda.function_name
  log_retention_days   = var.cloudwatch_log_retention_days
  tags                 = local.common_tags
}