const express = require("express");
const app = express();

const PORT = process.env.PORT || 8081;

app.get("/", (req, res) => {
  console.log("[INVENTORY-SERVICE] GET / request received");
  res.send("Inventory Service Running");
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

app.listen(PORT, () => {
  console.log(`[INVENTORY-SERVICE] Running on port ${PORT}`);
});
