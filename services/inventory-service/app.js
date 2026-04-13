const express = require("express");
const app = express();

const PORT = process.env.PORT || 8081;

app.get("/", (req, res) => {
  console.log("[INVENTORY-SERVICE] GET / request received");
  res.send("Inventory Service Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "inventory-service", timestamp: new Date().toISOString() });
});

app.get("/inventory/:item", (req, res) => {
  const item = req.params.item;
  console.log(`[INVENTORY-SERVICE] Checking stock for item: ${item}`);
  
  // Mock data for demonstration
  const stockLevels = {
    laptop: 15,
    mouse: 50,
    keyboard: 30
  };
  
  const stock = stockLevels[item.toLowerCase()] || 0;
  console.log(`[INVENTORY-SERVICE] Stock for ${item}: ${stock}`);
  
  res.json({
    item: item,
    stock: stock,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`[INVENTORY-SERVICE] Running on port ${PORT}`);
});

// Graceful Shutdown Logic
process.on("SIGTERM", () => {
  console.log("[INVENTORY-SERVICE] SIGTERM received. Closing server cleanly...");
  server.close(() => {
    console.log("[INVENTORY-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[INVENTORY-SERVICE] SIGINT received. Closing server cleanly...");
  server.close(() => {
    console.log("[INVENTORY-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});
