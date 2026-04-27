require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  product: String,
  time: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  name: String,
  message: String,
  time: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
const Message = mongoose.model("Message", messageSchema);

// Save Order
app.post("/api/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ status: "order_saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Message
app.post("/api/message", async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json({ status: "saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Backend running ✔");
});

// Get Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ time: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
