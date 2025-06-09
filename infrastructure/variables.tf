variable "lambda_image_uri" {
  description = "URI of the Lambda container image in ECR"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "api_rate_limit" {
  description = "API requests per second limit"
  type        = number
  default     = 10

  validation {
    condition     = var.api_rate_limit >= 1 && var.api_rate_limit <= 10000
    error_message = "API rate limit must be between 1 and 10,000 requests per second."
  }
}

variable "api_burst_limit" {
  description = "API burst capacity limit"
  type        = number
  default     = 20

  validation {
    condition     = var.api_burst_limit >= 1 && var.api_burst_limit <= 20000
    error_message = "API burst limit must be between 1 and 20,000 requests."
  }
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30

  validation {
    condition     = var.lambda_timeout >= 1 && var.lambda_timeout <= 900
    error_message = "Lambda timeout must be between 1 and 900 seconds."
  }
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 256

  validation {
    condition = contains([
      128, 256, 512, 1024, 1536, 2048, 3008, 4096, 5120, 6144, 7168, 8192, 9216, 10240
    ], var.lambda_memory_size)
    error_message = "Lambda memory size must be a valid value between 128 MB and 10,240 MB."
  }
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 14

  validation {
    condition = contains([
      1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, 3653
    ], var.cloudwatch_log_retention_days)
    error_message = "CloudWatch log retention days must be a valid CloudWatch retention period."
  }
}

locals {
  name = "acidizer-${var.environment}"

  common_tags = {
    Environment = var.environment
    Project     = "number-acidizer"
    ManagedBy   = "terraform"
  }
} 