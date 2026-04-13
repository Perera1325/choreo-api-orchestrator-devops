const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8082;

app.get("/", (req, res) => {
  res.send("Payment Service Running");
});

app.post("/pay", (req, res) => {
  const { amount, currency, orderId } = req.body;
  
  // Mock payment processing
  const transactionId = "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  console.log(`Processing payment of ${amount} ${currency} for order ${orderId}`);
  
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
  console.log(`Payment Service running on port ${PORT}`);
});
