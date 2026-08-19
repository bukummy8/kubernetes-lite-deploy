# Kubernetes-Lite Deploy

**Scaling microservices is hard.** This capstone addresses that Nigerian technology ecosystem challenge with a practical, lightweight deployment workflow: package a Node.js API, run it on K3s, scale it safely, expose it to users, and observe it with Kubernetes-native monitoring.

## Completed MVP

Kubernetes-Lite Deploy is a containerized Node.js microservice running on a lightweight K3s Kubernetes cluster. The completed MVP includes:

- Dockerized Node.js/Express API with `/`, `/api`, `/health`, and Prometheus `/metrics` endpoints.
- Kubernetes manifests for the application Deployment, NodePort Service, Ingress, and API `ServiceMonitor`.
- A K3s deployment flow that imports the locally built Docker image into the cluster, so the application can run without pulling from a remote registry.
- A Deployment configured for **3 replicas**. Scaling was demonstrated from 3 to 5 replicas and back to 3.
- NodePort access on **30360** and Traefik Ingress routing for `kubernetes-lite.local`.
- Liveness and readiness probes on `/health`, plus CPU and memory requests and limits.
- Prometheus metrics collection through `/metrics` and a `ServiceMonitor` for the API.
- kube-prometheus-stack and Grafana monitoring, including Prometheus, Grafana, kube-state-metrics, and node exporter components.
- GitHub Actions CI that runs npm tests, checks JavaScript syntax, builds the Docker image, and validates Kubernetes YAML offline.

## Architecture

```text
Developer → Docker image → local import → K3s cluster
                                            │
                         ┌──────────────────┴─────────────────┐
                         │                                    │
                    Deployment (3 pods)                  Monitoring
                         │                         Prometheus + Grafana
                         ▼                                    ▲
                NodePort :30360 / Ingress ── ServiceMonitor ─ /metrics
                         │
                         ▼
                 Node.js microservice
```

## Repository structure

```text
.
├── app/
│   ├── Dockerfile                 # Node.js application image
│   ├── server.js                  # Express API and Prometheus metrics
│   ├── package.json               # npm scripts and dependencies
│   └── test/api.test.js           # API tests
├── kubernetes/
│   ├── deployment.yaml            # 3-replica Deployment, probes, resources
│   ├── service.yaml               # API Service / NodePort exposure
│   ├── ingress.yaml               # kubernetes-lite.local route
│   ├── api-servicemonitor.yaml    # Prometheus scrape configuration
│   └── monitoring-values.yaml     # kube-prometheus-stack values
└── .github/workflows/ci.yml       # CI validation pipeline
```

## Prerequisites

- Docker
- Node.js 22 and npm
- A running K3s cluster with `kubectl` configured
- K3s' default Traefik Ingress controller
- Helm 3, for kube-prometheus-stack/Grafana installation

## Setup and deployment

Install the application dependencies and run the tests locally:

```bash
cd app
npm ci
npm test
node --check server.js
cd ..
```

Build the application image and import it into K3s. The Deployment uses `imagePullPolicy: Never`, so this local import is required:

```bash
docker build -t kubernetes-lite-api:1.1 ./app
docker save kubernetes-lite-api:1.1 | sudo k3s ctr images import -
```

Deploy the application resources:

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/api-servicemonitor.yaml
```

Install or update the monitoring stack, then apply the `ServiceMonitor` again if it was created before the Prometheus Operator CRDs were available:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  -f kubernetes/monitoring-values.yaml
kubectl apply -f kubernetes/api-servicemonitor.yaml
```

To resolve the Ingress hostname locally, add the K3s node IP to your hosts file:

```text
<K3S_NODE_IP> kubernetes-lite.local
```

## Verify and demonstrate

Check rollout status, pods, and Service exposure:

```bash
kubectl rollout status deployment/kubernetes-lite-api
kubectl get pods -l app=kubernetes-lite-api
kubectl get service kubernetes-lite-api
kubectl get ingress kubernetes-lite-api
```

Call the API through the NodePort and Ingress:

```bash
curl http://<K3S_NODE_IP>:30360/api
curl http://kubernetes-lite.local/api
curl http://kubernetes-lite.local/health
curl http://kubernetes-lite.local/metrics
```

Demonstrate horizontal scaling, then restore the intended 3-replica state:

```bash
kubectl scale deployment/kubernetes-lite-api --replicas=5
kubectl get pods -l app=kubernetes-lite-api
kubectl scale deployment/kubernetes-lite-api --replicas=3
kubectl rollout status deployment/kubernetes-lite-api
```

Verify that Prometheus discovers the API monitor:

```bash
kubectl get servicemonitor kubernetes-lite-api
kubectl -n monitoring port-forward service/monitoring-kube-prometheus-prometheus 9090:9090
```

Open `http://localhost:9090/targets` and confirm the API target is healthy. To access Grafana:

```bash
kubectl -n monitoring port-forward service/monitoring-grafana 3001:80
```

Then open `http://localhost:3001` and sign in with the Grafana credentials configured for the monitoring release.

## CI

The GitHub Actions workflow runs on pushes and pull requests targeting `main`. It performs:

- `npm ci` and `npm test`
- `node --check server.js`
- a Docker image build
- offline YAML parsing validation for the Kubernetes manifests

## Expected capstone deliverables

- Source-controlled Node.js microservice, automated tests, and Dockerfile.
- K3s deployment manifests with replicas, health probes, resource controls, Service, and Ingress.
- Evidence of local image import and a successful K3s rollout.
- A scaling demonstration from 3 to 5 replicas and back to 3.
- Working NodePort (`30360`) and Ingress (`kubernetes-lite.local`) access.
- Prometheus scraping through the API `ServiceMonitor` and Grafana monitoring evidence.
- A passing GitHub Actions CI run.

## Future enhancements

- Deploy to a managed cloud Kubernetes service.
- Provision infrastructure with Terraform.
- Publish images to a container registry and extend CI into CD.
- Add TLS, secrets management, alerting rules, dashboards, and autoscaling.
