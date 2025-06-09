variable "name" {
  description = "Resource name prefix"
  type        = string
}

variable "api_name" {
  description = "API Gateway name for monitoring"
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name for monitoring"
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 14
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 