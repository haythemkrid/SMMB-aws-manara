output "alb_dns_name" {
  description = "ALB endpoint for the API"
  value       = aws_lb.main.dns_name
}

output "ecr_repository_urls" {
  description = "ECR repository URLs keyed by service"
  value       = { for name, repository in aws_ecr_repository.service : name => repository.repository_url }
}

output "cloud_map_namespace" {
  description = "Private DNS namespace used by ECS services"
  value       = aws_service_discovery_private_dns_namespace.main.name
}

output "database_endpoint" {
  description = "RDS endpoint when the database is enabled"
  value       = var.enable_database ? aws_db_instance.postgres[0].address : null
}

output "redis_endpoint" {
  description = "Redis endpoint when ElastiCache is enabled"
  value       = var.enable_redis ? aws_elasticache_replication_group.redis[0].primary_endpoint_address : null
}

output "frontend_url" {
  description = "CloudFront frontend URL"
  value       = var.enable_frontend ? "https://${aws_cloudfront_distribution.frontend[0].domain_name}" : null
}

output "secret_arn" {
  description = "Secrets Manager ARN containing runtime application secrets"
  value       = aws_secretsmanager_secret.app.arn
}