const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
});

test("GET /health returns a healthy response", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "healthy" });
});

test("GET /api returns service information", async () => {
  const response = await fetch(`${baseUrl}/api`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.service, "kubernetes-lite-api");
  assert.equal(body.environment, "development");
});
