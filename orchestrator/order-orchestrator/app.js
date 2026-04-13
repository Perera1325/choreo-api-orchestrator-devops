const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Service URLs from Environment Variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:8080";
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:8081";
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:8082";

// Configuration for Resilience
const AXIOS_TIMEOUT = 3000;
const MAX_PAYMENT_RETRIES = 2;

/**
 * Helper to perform an axios call with a simple retry mechanism
 */
async function callServiceWithRetry(config, retries = 0) {
  try {
    return await axios(config);
  } catch (err) {
    if (retries < MAX_PAYMENT_RETRIES) {
      console.log(`[ORCHESTRATOR] Retry attempt ${retries + 1} for ${config.url}`);
      return await callServiceWithRetry(config, retries + 1);
    }
    throw err;
  }
}

app.get("/", (req, res) => {
  console.log("[ORCHESTRATOR] GET / request received");
  res.send("Order Orchestrator Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "order-orchestrator", timestamp: new Date().toISOString() });
});

app.post("/order", async (req, res) => {
  const { userId, item, amount } = req.body;

  console.log(`[ORCHESTRATOR] Incoming Order Request - Item: ${item}, User: ${userId}`);

  try {
    // 1. Call User Service
    console.log("[ORCHESTRATOR] ---> Calling user-service...");
    let userResponse;
    try {
      userResponse = await axios.get(`${USER_SERVICE_URL}/user`, { timeout: AXIOS_TIMEOUT });
      console.log("[ORCHESTRATOR] <--- User service responded.");
    } catch (err) {
      console.error("[ORCHESTRATOR] ERROR: User service failure:", err.message);
      return res.status(500).json({ orderStatus: "FAILED", reason: "USER_SERVICE_UNAVAILABLE" });
    }

    // 2. Call Inventory Service
    console.log("[ORCHESTRATOR] ---> Calling inventory-service...");
    let inventoryResponse;
    try {
      inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/${item}`, { timeout: AXIOS_TIMEOUT });
      console.log(`[ORCHESTRATOR] <--- Inventory service responded. Stock: ${inventoryResponse.data.stock}`);
      
      if (inventoryResponse.data.stock <= 0) {
        console.log("[ORCHESTRATOR] Order failed: OUT_OF_STOCK");
        return res.status(400).json({ 
          orderStatus: "FAILED", 
          reason: "OUT_OF_STOCK",
          item: item
        });
      }
    } catch (err) {
      console.error("[ORCHESTRATOR] ERROR: Inventory service failure:", err.message);
      return res.status(500).json({ orderStatus: "FAILED", reason: "INVENTORY_SERVICE_UNAVAILABLE" });
    }

    // 3. Call Payment Service (with Retry Logic)
    console.log("[ORCHESTRATOR] ---> Calling payment-service (with retry support)...");
    let paymentResponse;
    try {
      paymentResponse = await callServiceWithRetry({
        method: 'post',
        url: `${PAYMENT_SERVICE_URL}/pay`,
        data: {
          amount: amount,
          currency: "USD",
          orderId: "ORD" + Date.now()
        },
        timeout: AXIOS_TIMEOUT
      });
      console.log("[ORCHESTRATOR] <--- Payment service responded successfully.");
    } catch (err) {
      console.error("[ORCHESTRATOR] ERROR: Payment service failure after retries:", err.message);
      return res.status(402).json({ 
        orderStatus: "FAILED", 
        reason: "PAYMENT_FAILED",
        details: err.message
      });
    }

    // 4. Final Success Response
    const finalResult = {
      orderStatus: "CONFIRMED",
      user: userResponse.data,
      inventory: inventoryResponse.data,
      payment: paymentResponse.data,
      orchestrationTimestamp: new Date().toISOString()
    };

    console.log("[ORCHESTRATOR] Order successfully processed.");
    res.json(finalResult);

  } catch (error) {
    console.error("[ORCHESTRATOR] CRITICAL: Unexpected orchestration error:", error.message);
    res.status(500).json({ orderStatus: "FAILED", reason: "INTERNAL_SERVER_ERROR" });
  }
});

app.listen(PORT, () => {
  console.log(`[ORCHESTRATOR] Running on port ${PORT}`);
});
