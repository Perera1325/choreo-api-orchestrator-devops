const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8082;

app.get("/", (req, res) => {
  console.log("[PAYMENT-SERVICE] GET / request received");
  res.send("Payment Service Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "payment-service", timestamp: new Date().toISOString() });
});

app.post("/pay", (req, res) => {
  const { amount, currency, orderId } = req.body;
  console.log(`[PAYMENT-SERVICE] POST /pay request received for order: ${orderId}`);
  
  // Mock payment processing
  const transactionId = "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  console.log(`[PAYMENT-SERVICE] Processing payment of ${amount} ${currency} for order ${orderId}`);
  console.log(`[PAYMENT-SERVICE] Transaction successful: ${transactionId}`);
  
  res.json({
    status: "success",
    transactionId: transactionId,
    amount: amount,
    currency: currency,
    orderId: orderId,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`[PAYMENT-SERVICE] Running on port ${PORT}`);
});

// Graceful Shutdown Logic
process.on("SIGTERM", () => {
  console.log("[PAYMENT-SERVICE] SIGTERM received. Closing server cleanly...");
  server.close(() => {
    console.log("[PAYMENT-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[PAYMENT-SERVICE] SIGINT received. Closing server cleanly...");
  server.close(() => {
    console.log("[PAYMENT-SERVICE] Server closed. Process exiting.");
    process.exit(0);
  });
});
