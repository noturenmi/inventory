// ==============================
// Inventory API (Local + Vercel Compatible)
// Node.js + Express + MongoDB Atlas
// ==============================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// MongoDB Connection (1-time only)
// ===========================
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI not set in .env");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("📡 MongoDB Connected.");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err; // propagate error
  }
}

// ===========================
// MODELS
// ===========================
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: String,
  phone: String,
  email: String,
  address: String,
});
const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "General" },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
});
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

// ===========================
// ROUTES (root-level)
// ===========================

// Root
app.get("/", (req, res) => {
  res.send("📦 Inventory API is running!");
});

// --- ITEMS ---
app.post("/items", async (req, res) => {
  await connectToDatabase();
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/items", async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/items/:id", async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findById(req.params.id).populate("supplier");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/items/:id", async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/items/:id", async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SUPPLIERS ---
app.post("/suppliers", async (req, res) => {
  await connectToDatabase();
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/suppliers", async (req, res) => {
  await connectToDatabase();
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================
// Local Server Start
// ===========================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Local server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => console.error("❌ Failed to start server:", err));
}

// ===========================
// Export app for Vercel
// ===========================
module.exports = app;