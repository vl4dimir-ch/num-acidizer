# Lambda function
resource "aws_lambda_function" "backend" {
  function_name = "${var.name}-backend"
  role          = var.lambda_role_arn
  package_type  = "Image"
  image_uri     = var.lambda_image_uri
  timeout       = var.timeout
  memory_size   = var.memory_size

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name
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

 