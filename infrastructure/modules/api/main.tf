# API Gateway REST API
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.name}-api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.tags
}

# Counter resource
resource "aws_api_gateway_resource" "counter" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "counter"
}

# Counter increment resource
resource "aws_api_gateway_resource" "counter_increment" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.counter.id
  path_part   = "increment"
}

# Counter decrement resource
resource "aws_api_gateway_resource" "counter_decrement" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.counter.id
  path_part   = "decrement"
}

# API Key for rate limiting
resource "aws_api_gateway_api_key" "acidizer_key" {
  name = "${var.name}-api-key"
  tags = var.tags
}

# Usage plan with throttling
resource "aws_api_gateway_usage_plan" "api_plan" {
  name = "${var.name}-usage-plan"

  throttle_settings {
    rate_limit  = var.rate_limit
    burst_limit = var.burst_limit
  }

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.api.stage_name
  }

  tags = var.tags

  depends_on = [aws_api_gateway_stage.api]
}

resource "aws_api_gateway_usage_plan_key" "api_plan_key" {
  key_id        = aws_api_gateway_api_key.acidizer_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.api_plan.id
}

# Request validator for input validation
resource "aws_api_gateway_request_validator" "validator" {
  name                        = "${var.name}-validator"
  rest_api_id                 = aws_api_gateway_rest_api.api.id
  validate_request_body       = true
  validate_request_parameters = false
}

# HTTP Methods for /counter
resource "aws_api_gateway_method" "counter_get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "counter_options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# HTTP Methods for /counter/increment
resource "aws_api_gateway_method" "counter_increment_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter_increment.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "counter_increment_options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter_increment.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# HTTP Methods for /counter/decrement
resource "aws_api_gateway_method" "counter_decrement_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter_decrement.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "counter_decrement_options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.counter_decrement.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Lambda integrations for /counter
resource "aws_api_gateway_integration" "counter_get" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter.id
  http_method             = aws_api_gateway_method.counter_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

resource "aws_api_gateway_integration" "counter_options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter.id
  http_method             = aws_api_gateway_method.counter_options.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Lambda integrations for /counter/increment
resource "aws_api_gateway_integration" "counter_increment_post" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter_increment.id
  http_method             = aws_api_gateway_method.counter_increment_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

resource "aws_api_gateway_integration" "counter_increment_options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter_increment.id
  http_method             = aws_api_gateway_method.counter_increment_options.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Lambda integrations for /counter/decrement
resource "aws_api_gateway_integration" "counter_decrement_post" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter_decrement.id
  http_method             = aws_api_gateway_method.counter_decrement_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

resource "aws_api_gateway_integration" "counter_decrement_options" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.counter_decrement.id
  http_method             = aws_api_gateway_method.counter_decrement_options.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# API Deployment
resource "aws_api_gateway_deployment" "api" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  depends_on = [
    aws_api_gateway_integration.counter_get,
    aws_api_gateway_integration.counter_options,
    aws_api_gateway_integration.counter_increment_post,
    aws_api_gateway_integration.counter_increment_options,
    aws_api_gateway_integration.counter_decrement_post,
    aws_api_gateway_integration.counter_decrement_options,
    aws_api_gateway_gateway_response.default_4xx,
    aws_api_gateway_gateway_response.default_5xx,
  ]

  # Force redeployment when integrations change
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.counter_get.id,
      aws_api_gateway_integration.counter_options.id,
      aws_api_gateway_integration.counter_increment_post.id,
      aws_api_gateway_integration.counter_increment_options.id,
      aws_api_gateway_integration.counter_decrement_post.id,
      aws_api_gateway_integration.counter_decrement_options.id,
      aws_api_gateway_gateway_response.default_4xx.id,
      aws_api_gateway_gateway_response.default_5xx.id,
    ]))
  }
}

# API Stage
resource "aws_api_gateway_stage" "api" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment
}

# Method settings for monitoring and throttling
resource "aws_api_gateway_method_settings" "api_throttling" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api.stage_name
  method_path = "*/*"

  settings {
    throttling_rate_limit  = var.rate_limit
    throttling_burst_limit = var.burst_limit
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = false
  }

  depends_on = [aws_api_gateway_stage.api]
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api" {
  action        = "lambda:InvokeFunction"
  function_name = split("/", split("functions/", var.lambda_invoke_arn)[1])[0]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# Gateway responses for error handling
resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  response_type = "DEFAULT_4XX"

  response_templates = {
    "application/json" = jsonencode({
      message   = "$context.error.messageString"
      requestId = "$context.requestId"
    })
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  response_type = "DEFAULT_5XX"

  response_templates = {
    "application/json" = jsonencode({
      message   = "Internal server error"
      requestId = "$context.requestId"
    })
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
  }
} 