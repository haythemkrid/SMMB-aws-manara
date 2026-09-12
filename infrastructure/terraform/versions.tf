terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region

  access_key = var.localstack_enabled ? "test" : null
  secret_key = var.localstack_enabled ? "test" : null

  skip_credentials_validation = var.localstack_enabled
  skip_metadata_api_check     = var.localstack_enabled
  skip_requesting_account_id  = var.localstack_enabled
  skip_region_validation      = var.localstack_enabled
  s3_use_path_style           = var.localstack_enabled

  endpoints {
    apigateway           = var.localstack_enabled ? var.localstack_endpoint : null
    cloudformation       = var.localstack_enabled ? var.localstack_endpoint : null
    cloudwatch           = var.localstack_enabled ? var.localstack_endpoint : null
    dynamodb             = var.localstack_enabled ? var.localstack_endpoint : null
    ec2                  = var.localstack_enabled ? var.localstack_endpoint : null
    ecr                  = var.localstack_enabled ? var.localstack_endpoint : null
    ecs                  = var.localstack_enabled ? var.localstack_endpoint : null
    elasticache          = var.localstack_enabled ? var.localstack_endpoint : null
    elasticloadbalancing = var.localstack_enabled ? var.localstack_endpoint : null
    elbv2                = var.localstack_enabled ? var.localstack_endpoint : null
    iam                  = var.localstack_enabled ? var.localstack_endpoint : null
    kms                  = var.localstack_enabled ? var.localstack_endpoint : null
    logs                 = var.localstack_enabled ? var.localstack_endpoint : null
    route53              = var.localstack_enabled ? var.localstack_endpoint : null
    rds                  = var.localstack_enabled ? var.localstack_endpoint : null
    s3                   = var.localstack_enabled ? var.localstack_endpoint : null
    secretsmanager       = var.localstack_enabled ? var.localstack_endpoint : null
    servicediscovery     = var.localstack_enabled ? var.localstack_endpoint : null
    ses                  = var.localstack_enabled ? var.localstack_endpoint : null
    sts                  = var.localstack_enabled ? var.localstack_endpoint : null
  }

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}