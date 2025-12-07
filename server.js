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
// ROOT ROUTE - Welcome Page
// ===========================
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>📦 Inventory API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        .endpoint {
          background: #f9f9f9;
          padding: 15px;
          margin: 10px 0;
          border-left: 4px solid #4CAF50;
          border-radius: 4px;
        }
        code {
          background: #e0e0e0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }
        .status {
          color: #4CAF50;
          font-weight: bold;
        }
        a {
          color: #4CAF50;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📦 Inventory Management API</h1>
        <p class="status">✅ Server is running successfully!</p>
        <p>MongoDB Connection: <span class="status">Connected</span></p>
        
        <h2>📋 Available API Endpoints:</h2>
        
        <div class="endpoint">
          <strong>Items</strong><br>
          <code>GET /api/v1/items</code> - Get all items<br>
          <code>POST /api/v1/items</code> - Create new item<br>
          <code>GET /api/v1/items/:id</code> - Get item by ID<br>
          <code>PUT /api/v1/items/:id</code> - Update item<br>
          <code>DELETE /api/v1/items/:id</code> - Delete item
        </div>
        
        <div class="endpoint">
          <strong>Suppliers</strong><br>
          <code>GET /api/v1/suppliers</code> - Get all suppliers<br>
          <code>POST /api/v1/suppliers</code> - Create new supplier
        </div>
        
        <div class="endpoint">
          <strong>Categories</strong><br>
          <code>GET /api/v1/categories</code> - Get all categories
        </div>
        
        <div class="endpoint">
          <strong>Reports</strong><br>
          <code>GET /api/v1/reports/inventory</code> - Inventory report
        </div>
        
        <p>Try these endpoints using Postman, curl, or your frontend application.</p>
        
        <p><strong>Quick Test Links:</strong></p>
        <ul>
          <li><a href="/api/v1/items" target="_blank">View all items</a></li>
          <li><a href="/api/v1/suppliers" target="_blank">View all suppliers</a></li>
          <li><a href="/api/v1/categories" target="_blank">View all categories</a></li>
          <li><a href="/api/v1/reports/inventory" target="_blank">View inventory report</a></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

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