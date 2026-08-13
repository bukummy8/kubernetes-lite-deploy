const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    project: "Kubernetes-Lite Deploy",
    message: "Microservice is running",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/api", (req, res) => {
  res.json({
    service: "kubernetes-lite-api",
    environment: process.env.NODE_ENV || "development",
    message: "Hello from the Kubernetes-Lite Deploy microservice!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});