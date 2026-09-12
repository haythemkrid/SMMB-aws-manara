# SMMB on ECS Fargate — Phases & Issues

Each issue is tagged by the kind of work it is, so you can pick up whichever
lane matches what you want to practice or divide it across a team:

- `dev` — application code (backend services, frontend integration, tests)
- `devops` — Dockerfiles, CI/CD pipeline, build automation, runbooks
- `cloud` — AWS infrastructure and configuration (networking, IAM, managed services)

Phases are numbered in a sensible build order, but phases 2–4 (the three
services) can run in parallel once phase 1 is done.

## Phase summary

| # | Phase | Focus |
|---|---|---|
| 0 | Foundations & planning | Repo, API contracts, schema design |
| 1 | Networking & data layer | VPC, RDS, ElastiCache, Secrets Manager |
| 2 | Auth service | Login, JWT, user management |
| 3 | Requests service | Maintenance request workflow |
| 4 | Notifications service | Status-change emails |
| 5 | Registry & service discovery | ECR, Cloud Map, task definitions |
| 6 | Load balancing & ingress | ALB, path routing |
| 7 | Frontend hosting & integration | S3, CloudFront, API wiring |
| 8 | CI/CD pipeline | CodePipeline, CodeBuild, CodeDeploy blue/green |
| 9 | Observability & security hardening | X-Ray, alarms, least privilege |
| 10 | Testing, docs & demo | E2E test, runbook, recording |

---

## Phase 0 — Foundations & planning

- [ ] Define API contracts (OpenAPI/Swagger) for Auth, Requests, and Notifications — `dev`
- [ ] Design the RDS schema per service (`users`; `requests`, `replacement_parts`; `notification_log`) — `dev` `cloud`
- [ ] Initialize monorepo structure (`frontend/`, `services/*`, `infrastructure/`) — `devops`
- [ ] Choose and set up IaC tooling (CDK, Terraform, or CloudFormation) and remote state — `devops` `cloud`
- [ ] Create IAM users/roles for your own AWS access, enable MFA, set a billing alarm — `cloud`

## Phase 1 — Networking & data layer

- [ ] Provision a VPC with public + private subnets across 2 AZs — `cloud`
- [ ] Set up VPC endpoints for ECR, Secrets Manager, and CloudWatch Logs (or a NAT Gateway) — `cloud`
- [ ] Provision RDS Postgres (Multi-AZ); create the three schemas and least-privilege DB users — `cloud`
- [ ] Provision an ElastiCache Redis cluster in the private subnet — `cloud`
- [ ] Create Secrets Manager secrets for DB credentials and the JWT signing key — `cloud`
- [ ] Write reusable IaC modules for VPC / RDS / ElastiCache / Secrets Manager — `devops` `cloud`

## Phase 2 — Auth service

- [ ] Build login endpoint: verify credentials, issue JWT — `dev`
- [ ] Implement user CRUD endpoints (create/edit/deactivate) and the role model — `dev`
- [ ] Integrate ElastiCache for refresh-token/session storage and revocation — `dev`
- [ ] Write unit and integration tests — `dev`
- [ ] Write the Dockerfile — `devops`
- [ ] Define the task execution role and task role, scoped to Auth's own secrets and DB schema — `cloud`

## Phase 3 — Requests service

- [ ] Build request CRUD + status transitions (pending → accepted → assigned → in-progress → completed → confirmed / refused) — `dev`
- [ ] Build intervention report and replacement-parts endpoints — `dev`
- [ ] Implement the internal client that calls Auth (via Cloud Map DNS) to fetch the active worker list — `dev`
- [ ] Implement the internal client that calls Notifications on every status change — `dev`
- [ ] Write unit and integration tests — `dev`
- [ ] Write the Dockerfile — `devops`
- [ ] Define IAM roles scoped to Requests' own DB schema and Cloud Map lookups only — `cloud`

## Phase 4 — Notifications service

- [ ] Build the endpoint that receives a status-change event and sends an email via SES — `dev`
- [ ] Store a notification log in its own schema — `dev`
- [ ] (Stretch) Put an SQS queue between Requests and Notifications for async decoupling — `dev` `cloud`
- [ ] Write the Dockerfile — `devops`
- [ ] Verify the SES sender identity/domain — `cloud`
- [ ] Define an IAM role granting only `ses:SendEmail` — `cloud`

## Phase 5 — Registry & service discovery

- [ ] Create ECR repositories for all three services with scan-on-push enabled — `devops` `cloud`
- [ ] Create a Cloud Map private DNS namespace — `cloud`
- [ ] Write ECS task definitions (CPU/memory sizing, container + log config) for each service — `cloud`
- [ ] Create the three ECS Fargate services with service discovery registration — `cloud`

## Phase 6 — Load balancing & ingress

- [ ] Create the ALB in public subnets with a target group per service — `cloud`
- [ ] Configure path-based listener rules (`/api/auth`, `/api/requests`, `/api/notifications`) — `cloud`
- [ ] (Stretch) Attach AWS WAF to the ALB — `cloud`
- [ ] Smoke-test each path route end-to-end after deploy — `devops`

## Phase 7 — Frontend hosting & integration

- [ ] Point the frontend's API base URL at the ALB/custom domain — `dev`
- [ ] Replace the mock `AuthService` calls with real calls to the Auth service — `dev`
- [ ] Add a pipeline step that builds the Vite app and syncs it to S3 — `devops`
- [ ] Create the S3 bucket (private, origin access control) and CloudFront distribution — `cloud`
- [ ] Set up Route 53 records for the frontend and API domains — `cloud`

## Phase 8 — CI/CD pipeline

- [ ] Write `buildspec.yml` per service (install, test, build, docker build/push) — `devops`
- [ ] Create a CodePipeline with source, build, and deploy stages per service — `devops`
- [ ] Configure CodeDeploy for ECS blue/green deployment — `devops` `cloud`
- [ ] Configure automatic rollback on failed health checks/alarms — `devops` `cloud`
- [ ] Create least-privilege IAM roles for CodePipeline/CodeBuild/CodeDeploy — `cloud`

## Phase 9 — Observability & security hardening

- [ ] Enable X-Ray tracing on all three services and review the service map — `cloud`
- [ ] Set up CloudWatch dashboards/alarms (CPU, memory, 5xx rate, RDS connections) — `devops` `cloud`
- [ ] Tighten security groups: ALB→ECS, ECS→RDS, ECS→ElastiCache only — `cloud`
- [ ] Run an IAM least-privilege review across all task/execution roles — `cloud`
- [ ] Add structured logging with request/correlation IDs across services — `dev`

## Phase 10 — Testing, docs & demo

- [ ] Write an end-to-end test covering the full request lifecycle across all 3 services — `dev`
- [ ] Write a deployment runbook (one-time setup + redeploy steps) — `devops`
- [ ] Finalize README and architecture diagrams — `dev`
- [ ] Record the demo video or deploy to a live, presentable environment — `devops`
- [ ] Write a tear-down/cost-cleanup checklist for after the demo — `cloud`