# Reference existing resources
data "aws_ecr_repository" "backend" {
  name = "${var.name}-backend"
}

data "aws_dynamodb_table" "counter" {
  name = "${var.name}-counter"
}

data "aws_iam_role" "lambda_role" {
  name = "${var.name}-lambda-role"
}

# Lambda function
resource "aws_lambda_function" "backend" {
  function_name = "${var.name}-backend"
  role          = data.aws_iam_role.lambda_role.arn
  package_type  = "Image"
  image_uri     = var.lambda_image_uri
  timeout       = var.timeout
  memory_size   = var.memory_size

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = data.aws_dynamodb_table.counter.name
    }
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [
      # Ignore changes to image_uri as it's updated outside of Terraform
      image_uri,
    ]
  }
}

 