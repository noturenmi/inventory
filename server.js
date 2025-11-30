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

const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// API Prefix
// ===========================
const apiPrefix = "/api/v1";

// ===========================
// Swagger Documentation (static JSON)
// ===========================
const swaggerDocument = require("./swagger.json");

// Serve swagger generated JSON (required for Vercel)
app.get(`${apiPrefix}/swagger.json`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// Serve Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// ===========================
// MongoDB Connection
// ===========================
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const database = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = database.connections[0].readyState === 1;
    console.log("📡 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
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
  address: String
});
const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "General" },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
});
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

// ===========================
// ROUTES
// ===========================

// ----------------- ITEMS -----------------
app.get(`${apiPrefix}/items`, async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post(`${apiPrefix}/items`, async (req, res) => {
  await connectToDatabase();
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  try {
    const removed = await Item.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- SUPPLIERS -----------------
app.get(`${apiPrefix}/suppliers`, async (req, res) => {
  await connectToDatabase();
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

// ----------------- CATEGORIES -----------------
app.get(`${apiPrefix}/categories`, async (req, res) => {
  await connectToDatabase();
  try {
    const categories = await Item.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- REPORTS -----------------
app.get(`${apiPrefix}/reports/inventory`, async (req, res) => {
  await connectToDatabase();
  try {
    const items = await Item.find().populate("supplier");

    const totalItems = items.length;
    const totalStock = items.reduce((s, i) => s + i.stock, 0);
    const totalValue = items.reduce((s, i) => s + i.stock * i.price, 0);

    const categorySummary = {};

    items.forEach((i) => {
      if (!categorySummary[i.category])
        categorySummary[i.category] = { count: 0, totalStock: 0, totalValue: 0 };

      categorySummary[i.category].count++;
      categorySummary[i.category].totalStock += i.stock;
      categorySummary[i.category].totalValue += i.stock * i.price;
    });

    res.json({
      totalItems,
      totalStock,
      totalValue,
      byCategory: categorySummary,
      lowStock: items.filter((i) => i.stock <= 5),
      lowStockThreshold: 5
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================
// Root Page
// ===========================
app.get("/", (req, res) => {
  res.send("📦 Inventory API is running! Visit /api-docs for documentation.");
});

// ===========================
// Local Development Listener
// ===========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Local server running → http://localhost:${PORT}`)
  );
}

// Export for Vercel
module.exports = app;
