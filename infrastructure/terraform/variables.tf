variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "localstack_enabled" {
  description = "Route AWS provider calls to the local LocalStack emulator."
  type        = bool
  default     = false
}

variable "localstack_endpoint" {
  description = "LocalStack edge endpoint used by the AWS provider."
  type        = string
  default     = "http://localhost.localstack.cloud:4566"
}

variable "project_name" {
  type    = string
  default = "smmb"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.42.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "redis_node_type" {
  type    = string
  default = "cache.t4g.micro"
}

variable "container_image_tag" {
  type    = string
  default = "latest"
}

variable "frontend_domain" {
  type    = string
  default = ""
}

variable "ses_sender_email" {
  type    = string
  default = ""
}

variable "enable_frontend" {
  type    = bool
  default = true
}

variable "enable_database" {
  type    = bool
  default = true
}

variable "enable_redis" {
  type    = bool
  default = true
}