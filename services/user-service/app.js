const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  console.log("[USER-SERVICE] GET / request received");
  res.send("User Service Running");
});

app.get("/user", (req, res) => {
  console.log("[USER-SERVICE] GET /user request received");
  res.json({ id: 1, name: "Vinod" });
});

app.listen(PORT, () => {
  console.log(`[USER-SERVICE] Running on port ${PORT}`);
});
