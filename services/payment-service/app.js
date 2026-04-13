const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8082;

app.get("/", (req, res) => {
  console.log("[PAYMENT-SERVICE] GET / request received");
  res.send("Payment Service Running");
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

app.listen(PORT, () => {
  console.log(`[PAYMENT-SERVICE] Running on port ${PORT}`);
});
