// ==============================
// Inventory API 
// Node.js + Express + MongoDB Atlas
// Vercel-ready with Swagger UI
// ==============================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// API Prefix
// ===========================
const apiPrefix = "/api/v1";

//===========================
// Root endpoint
//===========================
app.get("/", (req, res) => {
  res.send("📦 Inventory API is running!");
});

//===========================
// Serve Swagger JSON
//===========================
app.get(`${apiPrefix}/swagger.json`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecs);
});

//===========================
// Swagger UI
//===========================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerUrl: `${apiPrefix}/swagger.json`,
  })
);

//===========================
// MongoDB Connection 
//===========================
let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
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

//===========================
// ROUTES
//===========================

// ---------- ITEMS ----------
app.post(`${apiPrefix}/items`, async (req, res) => {
  await connectToDatabase();
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get(`${apiPrefix}/items`, async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findById(req.params.id).populate("supplier");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- SUPPLIERS ----------
app.post(`${apiPrefix}/suppliers`, async (req, res) => {
  await connectToDatabase();
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get(`${apiPrefix}/suppliers`, async (req, res) => {
  await connectToDatabase();
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- CATEGORIES ----------
app.get(`${apiPrefix}/categories`, async (req, res) => {
  await connectToDatabase();
  try {
    const categories = await Item.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- INVENTORY REPORT ----------
app.get(`${apiPrefix}/reports/inventory`, async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");
    const totalItems = items.length;
    const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
    const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);

    const byCategory = {};
    items.forEach((i) => {
      if (!byCategory[i.category]) byCategory[i.category] = { count: 0, totalStock: 0, totalValue: 0 };
      byCategory[i.category].count += 1;
      byCategory[i.category].totalStock += i.stock;
      byCategory[i.category].totalValue += i.stock * i.price;
    });

    const categorySummary = Object.keys(byCategory).map((cat) => ({
      _id: cat,
      count: byCategory[cat].count,
      totalStock: byCategory[cat].totalStock,
      totalValue: byCategory[cat].totalValue,
    }));

    const lowStock = items.filter((i) => i.stock <= 5);

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

//===========================
// Export for Vercel
//===========================
module.exports = app;