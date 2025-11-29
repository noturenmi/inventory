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

//===========================
// Serve Swagger JSON
//===========================
app.get("/swagger.json", (req, res) => {
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
    swaggerUrl: "/swagger.json",
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check API status
 *     responses:
 *       200:
 *         description: API is running
 */
app.get("/", (req, res) => {
  res.send("📦 Inventory API is running!");
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: List of items
 *   post:
 *     summary: Add a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *               supplier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created
 */
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

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 *       404:
 *         description: Item not found
 *   put:
 *     summary: Update item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *               supplier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
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

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     responses:
 *       200:
 *         description: List of suppliers
 *   post:
 *     summary: Add a new supplier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier created
 */
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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get distinct item categories
 *     responses:
 *       200:
 *         description: List of categories
 */
app.get("/categories", async (req, res) => {
  await connectToDatabase();
  try {
    const categories = await Item.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reports/inventory:
 *   get:
 *     summary: Get inventory summary report
 *     responses:
 *       200:
 *         description: Inventory report
 */
app.get("/reports/inventory", async (req, res) => {
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
      byCategory[item.category].count += 1;
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

//===========================
// Local Development Listener
//===========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Local server running on http://localhost:${PORT}`));
}

//===========================
// Export app for Vercel
//===========================
module.exports = app;