variable "name" {
  description = "Resource name prefix"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda function invoke ARN"
  type        = string
}

variable "rate_limit" {
  description = "API requests per second limit"
  type        = number
  default     = 10
}

variable "burst_limit" {
  description = "API burst capacity limit"
  type        = number
  default     = 20
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 