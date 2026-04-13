const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Service URLs from Environment Variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:8080";
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:8081";
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:8082";

app.get("/", (req, res) => {
  res.send("Order Orchestrator Running");
});

app.post("/order", async (req, res) => {
  const { userId, item, amount } = req.body;

  try {
    console.log(`Starting orchestration for order: ${item} by user ${userId}`);

    // 1. Call User Service
    let userResponse;
    try {
      userResponse = await axios.get(`${USER_SERVICE_URL}/user`);
    } catch (err) {
      console.error("User service failure:", err.message);
      return res.status(500).json({ status: "error", message: "USER_SERVICE_UNAVAILABLE" });
    }

    // 2. Call Inventory Service
    let inventoryResponse;
    try {
      inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/${item}`);
      if (inventoryResponse.data.stock <= 0) {
        return res.status(400).json({ status: "failed", message: "OUT_OF_STOCK" });
      }
    } catch (err) {
      console.error("Inventory service failure:", err.message);
      return res.status(500).json({ status: "error", message: "INVENTORY_SERVICE_UNAVAILABLE" });
    }

    // 3. Call Payment Service
    let paymentResponse;
    try {
      paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/pay`, {
        amount: amount,
        currency: "USD",
        orderId: "ORD" + Date.now()
      });
    } catch (err) {
      console.error("Payment service failure:", err.message);
      return res.status(400).json({ status: "failed", message: "PAYMENT_FAILED" });
    }

    // 4. Combine results
    res.json({
      orderStatus: "CONFIRMED",
      user: userResponse.data,
      inventory: inventoryResponse.data,
      payment: paymentResponse.data,
      orchestrationTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Critical orchestration error:", error.message);
    res.status(500).json({ status: "error", message: "INTERNAL_ORCHESTRATION_ERROR" });
  }
});

app.listen(PORT, () => {
  console.log(`Order Orchestrator running on port ${PORT}`);
});
