const express = require("express");
const app = express();

const PORT = process.env.PORT || 8081;

app.get("/", (req, res) => {
  res.send("Inventory Service Running");
});

app.get("/inventory/:item", (req, res) => {
  const item = req.params.item;
  // Mock data for demonstration
  const stockLevels = {
    laptop: 15,
    mouse: 50,
    keyboard: 30
  };
  
  const stock = stockLevels[item.toLowerCase()] || 0;
  
  res.json({
    item: item,
    stock: stock,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});
