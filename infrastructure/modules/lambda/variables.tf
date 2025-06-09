variable "name" {
  description = "Resource name prefix"
  type        = string
}

variable "lambda_image_uri" {
  description = "URI of the Lambda container image in ECR"
  type        = string
}

variable "timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 256
}

variable "lambda_role_arn" {
  description = "ARN of the IAM role for Lambda"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 