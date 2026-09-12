# Infrastructure as code

The deployable stack is in [`terraform/`](terraform/). It provisions the
network, private data tier, registries, service discovery, ECS Fargate
services, ALB routing, runtime secrets, and private S3/CloudFront frontend.

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt -check
terraform validate
terraform plan
```

### LocalStack

With `lstk` running, validate and deploy the AWS control-plane resources into
the emulator without touching a real AWS account:

```bash
cd infrastructure/terraform
cp localstack.tfvars.example localstack.tfvars
terraform init
terraform apply -var-file=localstack.tfvars
```

The example disables RDS, ElastiCache, and CloudFront for a faster local loop.
The ECS, ECR, IAM, Cloud Map, ALB, VPC, Secrets Manager, and CloudWatch
resources remain enabled. LocalStack resource support varies by edition and
version; `terraform plan` is the first diagnostic if a service is unavailable.
LocalStack exposes the emulated ALB through its edge port `4566`; the same
configuration uses port `80` automatically when deployed to real AWS.

Apply only after reviewing the plan. The default development stack creates a
NAT gateway, RDS, and ElastiCache, so it incurs AWS charges. Set
`enable_database = false` or `enable_redis = false` for partial development
plans. RDS schemas (`auth`, `requests`, and `notifications`) still need to be
created by a migration job after the database is available.

The expected production inputs are:

- private subnets and security groups for ECS, RDS, and ElastiCache;
- Secrets Manager values for the database URL and JWT signing key;
- Cloud Map registrations named `auth`, `requests`, and `notifications`;
- an ALB with `/api/auth`, `/api/requests`, and `/api/notifications` rules;
- ECR repositories and ECS deployment configuration.

Local orchestration is provided by `docker-compose.yml` so infrastructure work
can be validated independently from AWS access.