output "api_url" {
  value       = module.api.api_url
  description = "Backend API URL"
}

output "frontend_bucket" {
  value       = module.frontend.bucket_name
  description = "Frontend S3 bucket name"
}

output "frontend_url" {
  value       = module.frontend.cloudfront_url
  description = "Frontend CloudFront URL"
}

output "api_key" {
  value       = module.api.api_key
  description = "API Key for rate limiting"
  sensitive   = true
}

output "lambda_function_name" {
  value       = module.lambda.function_name
  description = "Lambda function name"
} 