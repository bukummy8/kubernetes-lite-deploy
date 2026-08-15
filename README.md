# Kubernetes-Lite Deploy

A containerized Node.js microservice deployed to a lightweight Kubernetes cluster using K3s.

## Project Overview

This project demonstrates the practical deployment and orchestration of a Node.js microservice using Docker and Kubernetes.

### Current MVP

The current implementation covers:

- Building a Node.js microservice
- Containerizing the application with Docker
- Running the application in Docker
- Creating a lightweight Kubernetes cluster with K3s
- Importing a local Docker image into K3s
- Deploying the application with Kubernetes
- Exposing the application through a NodePort service
- Running multiple application replicas
- Scaling the application
- Configuring CPU and memory resources
- Configuring liveness and readiness probes
- Performing Kubernetes rolling updates
- Monitoring Kubernetes resource usage
- Testing API endpoints with curl
- Managing the project with Git

### Planned Next Stages

The following components are planned:

- GitHub repository
- GitHub Actions CI/CD
- Kubernetes Ingress
- Prometheus
- Grafana
- Terraform (optional)
- Cloud deployment (optional)

---

## MVP Architecture

### Current Implementation

```text
Developer
    │
    ▼
Git Repository
    │
    ▼
Docker Image
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
    └── NodePort Service
             │
             ▼
       Node.js Microservice