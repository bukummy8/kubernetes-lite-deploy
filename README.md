# Kubernetes-Lite Deploy

A containerized Node.js microservice deployed, scaled, monitored, and automatically delivered to a lightweight Kubernetes cluster using K3s, GitHub Actions, and GitHub Container Registry (GHCR).

## Nigerian Problem Context

**Scaling microservices is hard.**

As applications grow, manually managing multiple service instances becomes difficult. Kubernetes helps solve this problem by providing automated deployment, scaling, service discovery, health checks, and workload management.

This project demonstrates a practical lightweight Kubernetes approach for deploying and operating a microservice, including automated CI/CD.

## Project Overview

**Kubernetes-Lite Deploy** is a capstone project that deploys a small Node.js microservice to a K3s Kubernetes cluster.

The project demonstrates the complete workflow:

**Develop → Test → Containerize → Validate → Publish → Deploy → Expose → Scale → Monitor**

## Completed MVP Features

### Application

- Node.js microservice
- Express API
- Docker containerization
- `/` endpoint
- `/health` endpoint
- `/api` endpoint
- Prometheus `/metrics` endpoint

### Kubernetes

- K3s lightweight Kubernetes cluster
- Kubernetes Deployment
- 3 application replicas
- Demonstrated scaling from 3 replicas to 5 replicas and back to 3
- NodePort service on port `30360`
- Kubernetes Ingress
- Ingress host: `kubernetes-lite.local`
- Liveness probes
- Readiness probes
- CPU and memory resource configuration

### Monitoring

- Prometheus `/metrics` endpoint
- API ServiceMonitor
- kube-prometheus-stack monitoring
- Grafana deployment
- Prometheus scrape verification

### CI/CD

- GitHub Actions CI/CD workflow
- API automated tests
- JavaScript syntax validation
- Kubernetes YAML validation
- Automated Docker image build
- Docker image publishing to GitHub Container Registry (GHCR)
- Self-hosted GitHub Actions runner
- Automated deployment to K3s
- Exact Git commit SHA image deployment
- Kubernetes rollout verification
- API health verification

### Development

- API demonstration with `curl`
- Git version control
- GitHub repository

## Architecture

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions CI
    │
    ├── npm ci
    ├── npm test
    ├── JavaScript syntax check
    └── Kubernetes YAML validation
    │
    ▼
Docker Image Build
    │
    ▼
GitHub Container Registry (GHCR)
    │
    ├── latest
    └── Git Commit SHA
    │
    ▼
GitHub Actions CD
    │
    ▼
Self-Hosted GitHub Actions Runner
    │
    ▼
K3s Kubernetes Cluster
    │
    ├── Deployment
    │      │
    │      ├── Pod
    │      ├── Pod
    │      └── Pod
    │
    ├── Service
    │      │
    │      └── NodePort :30360
    │
    ├── Ingress
    │      │
    │      └── kubernetes-lite.local
    │
    └── ServiceMonitor
           │
           ▼
      Prometheus
           │
           ▼
        Grafana
```

## Application

The application is a Node.js and Express microservice.

### Available Endpoints

| Endpoint | Description |
|---|---|
| `/` | Project information |
| `/health` | Application health status |
| `/api` | API service information |
| `/metrics` | Prometheus metrics |

### Health Response

```json
{
  "status": "healthy"
}
```

### API Response

```json
{
  "service": "kubernetes-lite-api",
  "environment": "production",
  "message": "Hello from the Kubernetes-Lite Deploy microservice!"
}
```

## Kubernetes Deployment

The application runs as a Kubernetes Deployment with a desired state of **3 replicas**.

The project also demonstrated Kubernetes scaling by increasing the deployment to **5 replicas** and returning it to **3 replicas**.

The Deployment includes:

- Container configuration
- Resource requests and limits
- Liveness probe
- Readiness probe
- Replica management
- Rolling updates

Verify the deployment:

```bash
kubectl get deployment kubernetes-lite-api
```

Verify the pods:

```bash
kubectl get pods -l app=kubernetes-lite-api
```

Check the deployed container image:

```bash
kubectl get deployment kubernetes-lite-api \
  -o jsonpath='{.spec.template.spec.containers[0].image}'
echo
```

## Container Image Delivery

The CI/CD pipeline builds and publishes the application image to GitHub Container Registry.

The deployment uses an image tagged with the exact Git commit SHA.

Image format:

```text
ghcr.io/bukummy8/kubernetes-lite-api:<git-commit-sha>
```

This ensures that the Kubernetes deployment can be traced to a specific source code commit.

The pipeline also publishes:

```text
ghcr.io/bukummy8/kubernetes-lite-api:latest
```

## Service

The application is exposed through a Kubernetes NodePort service.

```text
Application Port: 3000
NodePort: 30360
```

Verify the service:

```bash
kubectl get svc kubernetes-lite-api
```

Test the application:

```bash
curl http://localhost:30360/
```

Test health:

```bash
curl http://localhost:30360/health
```

Test the API:

```bash
curl http://localhost:30360/api
```

## Ingress

The project includes a Kubernetes Ingress using Traefik.

Ingress host:

```text
kubernetes-lite.local
```

Verify the Ingress:

```bash
kubectl get ingress
```

Example test:

```bash
curl -H "Host: kubernetes-lite.local" http://10.0.2.15/
```

Health endpoint:

```bash
curl -H "Host: kubernetes-lite.local" http://10.0.2.15/health
```

API endpoint:

```bash
curl -H "Host: kubernetes-lite.local" http://10.0.2.15/api
```

## Monitoring

The application exposes Prometheus-compatible metrics through:

```text
/metrics
```

Test the metrics endpoint:

```bash
curl http://localhost:30360/metrics
```

The monitoring stack includes:

- Prometheus
- kube-prometheus-stack
- Grafana
- API ServiceMonitor

The API ServiceMonitor allows Prometheus to discover and scrape application metrics.

Verify ServiceMonitors:

```bash
kubectl get servicemonitor -A
```

Verify monitoring workloads:

```bash
kubectl get pods -n monitoring
```

Example application metric:

```text
http_requests_total
```

## Scaling Demonstration

Scale the application to 5 replicas:

```bash
kubectl scale deployment kubernetes-lite-api --replicas=5
```

Wait for the rollout:

```bash
kubectl rollout status deployment/kubernetes-lite-api
```

Verify the deployment:

```bash
kubectl get deployment kubernetes-lite-api
kubectl get pods -l app=kubernetes-lite-api
```

Return the application to the desired state of 3 replicas:

```bash
kubectl scale deployment kubernetes-lite-api --replicas=3
```

Verify:

```bash
kubectl rollout status deployment/kubernetes-lite-api
kubectl get deployment kubernetes-lite-api
```

## CI/CD Pipeline

GitHub Actions provides continuous integration and continuous deployment for the project.

The workflow runs when changes are pushed to the `main` branch.

### CI Stage

The CI job runs on GitHub-hosted infrastructure and performs:

1. Repository checkout
2. Node.js setup
3. Dependency installation with `npm ci`
4. API tests with `npm test`
5. JavaScript syntax validation
6. Kubernetes manifest YAML validation
7. Docker image build
8. Docker image publishing to GitHub Container Registry

The container image is tagged with:

- `latest`
- The exact Git commit SHA

### CD Stage

After the CI stage completes successfully, the deployment job runs on a self-hosted GitHub Actions runner connected to the K3s environment.

The CD process performs:

1. Repository checkout
2. Kubernetes manifest application
3. Deployment of the exact commit SHA image
4. Kubernetes rollout verification
5. Deployment verification
6. Pod verification
7. API health verification

The workflow is located at:

```text
.github/workflows/ci.yml
```

## Self-Hosted Runner

A self-hosted GitHub Actions runner is used for the deployment stage because it has access to the local K3s Kubernetes cluster.

The runner executes the deployment commands directly against the cluster.

The deployment workflow uses:

```bash
kubectl apply
```

to apply Kubernetes manifests and:

```bash
kubectl set image
```

to deploy the exact container image associated with the Git commit.

The deployment is then verified using:

```bash
kubectl rollout status
```

and:

```bash
curl http://localhost:30360/health
```

## Project Structure

```text
kubernetes-lite-deploy/
├── app/
│   ├── test/
│   │   └── api.test.js
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── kubernetes/
│   ├── api-servicemonitor.yaml
│   ├── deployment.yaml
│   ├── ingress.yaml
│   ├── monitoring-values.yaml
│   └── service.yaml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
└── README.md
```

## Prerequisites

To run this project, install:

- Git
- Node.js
- npm
- Docker
- Kubernetes CLI (`kubectl`)
- K3s
- Helm
- curl

For the automated deployment stage, configure:

- GitHub Actions
- GitHub Container Registry access
- A self-hosted GitHub Actions runner with access to the K3s cluster

## Setup

Clone the repository:

```bash
git clone https://github.com/bukummy8/kubernetes-lite-deploy.git
cd kubernetes-lite-deploy
```

Install application dependencies:

```bash
cd app
npm ci
```

Run the tests:

```bash
npm test
```

Check JavaScript syntax:

```bash
node --check server.js
```

Return to the project root:

```bash
cd ..
```

Build the Docker image locally:

```bash
docker build -t kubernetes-lite-api:1.0 ./app
```

Apply the Kubernetes manifests:

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/api-servicemonitor.yaml
```

Verify the rollout:

```bash
kubectl rollout status deployment/kubernetes-lite-api
```

## Useful Verification Commands

### Check Cluster Nodes

```bash
kubectl get nodes
```

### Check Deployment

```bash
kubectl get deployment kubernetes-lite-api
```

### Check Pods

```bash
kubectl get pods -l app=kubernetes-lite-api -o wide
```

### Check Service

```bash
kubectl get svc kubernetes-lite-api
```

### Check Ingress

```bash
kubectl get ingress
```

### Check the Deployed Image

```bash
kubectl get deployment kubernetes-lite-api \
  -o jsonpath='{.spec.template.spec.containers[0].image}'
echo
```

### Check ServiceMonitors

```bash
kubectl get servicemonitor -A
```

### Check Monitoring Workloads

```bash
kubectl get pods -n monitoring
```

### Test the Application

```bash
curl http://localhost:30360/
curl http://localhost:30360/health
curl http://localhost:30360/api
```

### Check Prometheus Metrics

```bash
curl http://localhost:30360/metrics
```

### Check Deployment Rollout

```bash
kubectl rollout status deployment/kubernetes-lite-api
```

## Latest Deployment Verification

The latest successful deployment was verified with:

```text
Deployment: kubernetes-lite-api
Desired Replicas: 3
Ready Replicas: 3
Available Replicas: 3
Pod Status: Running
```

The deployed container image uses an exact Git commit SHA:

```text
ghcr.io/bukummy8/kubernetes-lite-api:<git-commit-sha>
```

The application health check returned:

```json
{
  "status": "healthy"
}
```

The API was also successfully verified:

```json
{
  "service": "kubernetes-lite-api",
  "environment": "production",
  "message": "Hello from the Kubernetes-Lite Deploy microservice!"
}
```

## Capstone Deliverables

The project deliverables include:

- [x] GitHub repository
- [x] Node.js microservice
- [x] Docker configuration
- [x] Kubernetes manifests
- [x] K3s deployment
- [x] Application scaling demonstration
- [x] API demonstration
- [x] GitHub Actions CI pipeline
- [x] GitHub Actions CD pipeline
- [x] GitHub Container Registry image publishing
- [x] Self-hosted deployment runner
- [x] Automated K3s deployment
- [x] Prometheus monitoring
- [x] Grafana monitoring
- [x] Architecture documentation
- [x] Project README
- [ ] 2–3 minute demonstration video
- [ ] Optional Infrastructure as Code
- [ ] Optional cloud deployment

## Future Enhancements

Possible future improvements include:

- Terraform Infrastructure as Code
- Cloud Kubernetes deployment
- Horizontal Pod Autoscaler
- Alertmanager rules and notifications
- Custom Grafana dashboards
- HTTPS and TLS certificates
- Kubernetes Secret management
- Multi-environment deployments
- Development, staging, and production environments
- Deployment approval gates
- Rollback automation
- Advanced Kubernetes security policies

## Project Status

**MVP Status: Completed**

The core capstone objective has been achieved.

A Node.js microservice has been:

- Containerized with Docker
- Tested automatically
- Validated through GitHub Actions
- Published to GitHub Container Registry
- Deployed to a lightweight K3s Kubernetes cluster
- Automatically delivered through a CI/CD pipeline
- Deployed using the exact Git commit SHA image
- Exposed through NodePort and Ingress
- Scaled successfully from 3 to 5 replicas and back to 3
- Protected with liveness and readiness probes
- Configured with CPU and memory resource limits
- Monitored using Prometheus and Grafana
- Verified using Kubernetes rollout checks and API health checks

The remaining primary capstone deliverable is the **2–3 minute demonstration video**.