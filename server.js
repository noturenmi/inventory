// ==============================
// Inventory API (Vercel-Ready)
// Node.js + Express + MongoDB Atlas
// ==============================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//===========================
// MongoDB Connection (Optimized for Serverless)
//===========================
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("📡 MongoDB Connected.");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

//===========================
// MODELS
//===========================
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
// API BASE ROUTER (/api/v1)
// ===========================
const router = express.Router();

// --- ROOT CHECK ---
router.get("/", (req, res) => {
  res.send("📦 Inventory API v1 is running!");
});

// --- ITEMS ---
router.post("/items", async (req, res) => {
  await connectToDatabase();
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/items", async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/items/:id", async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findById(req.params.id).populate("supplier");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/items/:id", async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/items/:id", async (req, res) => {
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
router.post("/suppliers", async (req, res) => {
  await connectToDatabase();
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/suppliers", async (req, res) => {
  await connectToDatabase();
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CATEGORIES ---
router.get("/categories", async (req, res) => {
  await connectToDatabase();
  try {
    const categories = await Item.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- REPORTS ---
router.get("/reports/inventory", async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");

    const totalItems = items.length;
    const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
    const totalValue = items.reduce((sum, item) => sum + item.stock * item.price, 0);

    const byCategory = {};
    items.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = { count: 0, totalStock: 0, totalValue: 0 };
      }
      byCategory[item.category].count++;
      byCategory[item.category].totalStock += item.stock;
      byCategory[item.category].totalValue += item.stock * item.price;
    });

    const categorySummary = Object.keys(byCategory).map(cat => ({
      _id: cat,
      count: byCategory[cat].count,
      totalStock: byCategory[cat].totalStock,
      totalValue: byCategory[cat].totalValue,
    }));

    const lowStock = items.filter(item => item.stock <= 5);

    res.json({
      totalItems,
      totalStock,
      totalValue,
      byCategory: categorySummary,
      lowStock,
      lowStockThreshold: 5,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================
// Mount router at /api/v1
// ===========================
app.use("/api/v1", router);

// ===========================
// Localhost (Optional - not used on Vercel)
// ===========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Local server running on http://localhost:${PORT}`)
  );
}

// ===========================
// Export for Vercel
// ===========================
module.exports = app;