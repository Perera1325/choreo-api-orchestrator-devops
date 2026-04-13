const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  console.log("[USER-SERVICE] GET / request received");
  res.send("User Service Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "user-service", timestamp: new Date().toISOString() });
});

app.get("/user", (req, res) => {
  console.log("[USER-SERVICE] GET /user request received");
  res.json({ id: 1, name: "Vinod" });
});

const server = app.listen(PORT, () => {
  console.log(`[USER-SERVICE] Running on port ${PORT}`);
});

// Graceful Shutdown Logic
process.on("SIGTERM", () => {
  console.log("[USER-SERVICE] SIGTERM received. Closing server cleanly...");
  server.close(() => {
    console.log("[USER-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[USER-SERVICE] SIGINT received. Closing server cleanly...");
  server.close(() => {
    console.log("[USER-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});
