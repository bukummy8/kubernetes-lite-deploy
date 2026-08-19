# Kubernetes-Lite Deploy

A containerized Node.js microservice deployed, scaled, monitored, and validated on a lightweight Kubernetes cluster using K3s.

## Nigerian Problem Context

**Scaling microservices is hard.**

As applications grow, manually managing multiple service instances becomes difficult. Kubernetes helps solve this problem by providing automated deployment, scaling, service discovery, health checks, and workload management.

This project demonstrates a practical lightweight Kubernetes approach for deploying and operating a microservice.

## Project Overview

**Kubernetes-Lite Deploy** is a capstone project that deploys a small Node.js microservice to a K3s Kubernetes cluster.

The project demonstrates the complete MVP workflow:

**Develop → Test → Containerize → Validate → Deploy → Expose → Scale → Monitor**

## Completed MVP Features

* Kubernetes manifests
* Docker containerization
* Node.js microservice
* K3s lightweight Kubernetes cluster
* Local Docker image import into K3s
* Kubernetes Deployment
* 3 application replicas
* Demonstrated scaling from 3 replicas to 5 replicas and back to 3
* NodePort service on port `30360`
* Kubernetes Ingress
* Ingress host: `kubernetes-lite.local`
* Liveness probes
* Readiness probes
* CPU and memory resource configuration
* Prometheus `/metrics` endpoint
* API ServiceMonitor
* kube-prometheus-stack monitoring
* Grafana deployment
* GitHub Actions CI pipeline
* API automated tests
* JavaScript syntax validation
* Docker image build validation
* Offline Kubernetes YAML validation
* API demonstration with `curl`
* Git version control and GitHub repository

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
    ├── npm test
    ├── JavaScript syntax check
    ├── Docker image build
    └── Offline YAML validation
    │
    ▼
Docker Image
    │
    ▼
Import Local Image into K3s
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

Available endpoints:

| Endpoint   | Description               |
| ---------- | ------------------------- |
| `/`        | Project information       |
| `/health`  | Application health status |
| `/api`     | API service information   |
| `/metrics` | Prometheus metrics        |

Example health response:

```json
{
  "status": "healthy"
}
```

## Kubernetes Deployment

The application runs as a Kubernetes Deployment with a desired state of **3 replicas**.

The project also demonstrated Kubernetes scaling by increasing the deployment to **5 replicas** and then returning it to **3 replicas**.

The Deployment includes:

* Container configuration
* Resource requests and limits
* Liveness probe
* Readiness probe
* Replica management

Verify the deployment:

```bash
kubectl get deployment kubernetes-lite-api
```

Verify the pods:

```bash
kubectl get pods -l app=kubernetes-lite-api
```

## Service

The application is exposed through a Kubernetes NodePort service.

Service port:

```text
Application Port: 3000
NodePort: 30360
```

Verify:

```bash
kubectl get svc kubernetes-lite-api
```

Test locally:

```bash
curl http://localhost:30360/
curl http://localhost:30360/health
curl http://localhost:30360/api
```

## Ingress

The project includes a Kubernetes Ingress using Traefik.

Ingress host:

```text
kubernetes-lite.local
```

Verify:

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

Example:

```bash
curl http://localhost:30360/metrics
```

The project uses:

* Prometheus
* kube-prometheus-stack
* Grafana
* ServiceMonitor for the API

The API ServiceMonitor allows Prometheus to discover and scrape the application metrics.

Verify ServiceMonitors:

```bash
kubectl get servicemonitor -A
```

Verify monitoring pods:

```bash
kubectl get pods -n monitoring
```

Example Prometheus metric:

```text
http_requests_total
```

The application was successfully verified as a Prometheus scrape target with all API replicas reporting `up = 1`.

## Scaling Demonstration

Scale the application to 5 replicas:

```bash
kubectl scale deployment kubernetes-lite-api --replicas=5
```

Wait for the rollout:

```bash
kubectl rollout status deployment/kubernetes-lite-api
```

Verify:

```bash
kubectl get deployment kubernetes-lite-api
kubectl get pods -l app=kubernetes-lite-api
```

Return to the project's desired state of 3 replicas:

```bash
kubectl scale deployment kubernetes-lite-api --replicas=3
kubectl rollout status deployment/kubernetes-lite-api
```

## CI Pipeline

GitHub Actions provides continuous integration for the project.

The CI workflow performs:

1. Repository checkout
2. Node.js setup
3. Dependency installation with `npm ci`
4. API tests with `npm test`
5. JavaScript syntax validation
6. Docker image build validation
7. Offline Kubernetes manifest YAML validation

The workflow is located at:

```text
.github/workflows/ci.yml
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

* Git
* Node.js
* npm
* Docker
* Kubernetes CLI (`kubectl`)
* K3s
* Helm
* curl

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

Build the Docker image:

```bash
docker build -t kubernetes-lite-api:1.0 ./app
```

For a local K3s deployment, ensure the application image is available to the K3s container runtime.

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

Check cluster nodes:

```bash
kubectl get nodes
```

Check deployment:

```bash
kubectl get deployment kubernetes-lite-api
```

Check pods:

```bash
kubectl get pods -l app=kubernetes-lite-api -o wide
```

Check service:

```bash
kubectl get svc kubernetes-lite-api
```

Check ingress:

```bash
kubectl get ingress
```

Check ServiceMonitors:

```bash
kubectl get servicemonitor -A
```

Check monitoring workloads:

```bash
kubectl get pods -n monitoring
```

Test the application:

```bash
curl http://localhost:30360/
curl http://localhost:30360/health
curl http://localhost:30360/api
```

Check Prometheus metrics:

```bash
curl http://localhost:30360/metrics
```

## Capstone Deliverables

The project deliverables include:

* [x] GitHub repository
* [x] Node.js microservice
* [x] Docker configuration
* [x] Kubernetes manifests
* [x] K3s deployment
* [x] Application scaling demonstration
* [x] API demonstration
* [x] GitHub Actions CI pipeline
* [x] Prometheus monitoring
* [x] Grafana monitoring
* [x] Architecture documentation
* [x] Project README
* [ ] 2–3 minute demonstration video
* [ ] Optional Infrastructure as Code
* [ ] Optional cloud deployment

## Future Enhancements

Possible future improvements include:

* Terraform Infrastructure as Code
* Cloud Kubernetes deployment
* Container image registry integration
* CD pipeline with automated deployment
* Horizontal Pod Autoscaler
* Alertmanager rules and notifications
* Custom Grafana dashboards
* HTTPS and TLS certificates
* Secret management
* Multi-environment deployments

## Project Status

**MVP Status: Completed**

The core capstone objective has been achieved: a Node.js microservice has been containerized, deployed to a lightweight K3s Kubernetes cluster, exposed through NodePort and Ingress, scaled successfully, monitored with Prometheus and Grafana, and validated through a GitHub Actions CI pipeline.

The remaining primary capstone deliverable is the **2–3 minute demonstration video**.
