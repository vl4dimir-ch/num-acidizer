output "api_log_group" {
  description = "API Gateway CloudWatch log group name"
  value       = aws_cloudwatch_log_group.api_logs.name
}

output "lambda_log_group" {
  description = "Lambda function CloudWatch log group name"
  value       = aws_cloudwatch_log_group.lambda_logs.name
} 