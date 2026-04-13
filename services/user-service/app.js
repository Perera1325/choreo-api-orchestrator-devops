const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("User Service Running");
});

app.get("/user", (req, res) => {
  res.json({ id: 1, name: "Vinod" });
});

app.listen(PORT, () => {
  console.log("User Service running on port " + PORT);
});
