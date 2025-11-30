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
const fs = require("fs");
const path = require("path");

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
// Load swagger.json
//===========================
const swaggerFile = path.join(__dirname, "swagger.json");
const swaggerDocs = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));

//===========================
// Swagger UI
//===========================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

//===========================
// ROUTES
//===========================

// ITEMS
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
  const items = await Item.find().populate("supplier");
  res.json(items);
});

// ITEM BY ID
app.get(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  const item = await Item.findById(req.params.id).populate("supplier");
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

app.put(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete(`${apiPrefix}/items/:id`, async (req, res) => {
  await connectToDatabase();
  const item = await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

// SUPPLIERS
app.post(`${apiPrefix}/suppliers`, async (req, res) => {
  await connectToDatabase();
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.status(201).json(supplier);
});

app.get(`${apiPrefix}/suppliers`, async (req, res) => {
  await connectToDatabase();
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

// CATEGORIES
app.get(`${apiPrefix}/categories`, async (req, res) => {
  await connectToDatabase();
  const categories = await Item.distinct("category");
  res.json(categories);
});

// INVENTORY REPORT
app.get(`${apiPrefix}/reports/inventory`, async (req, res) => {
  await connectToDatabase();
  const items = await Item.find();

  const totalItems = items.length;
  const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
  const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);

  res.json({ totalItems, totalStock, totalValue });
});

// ===========================
// Export for Vercel
// ===========================
module.exports = app;

// Local dev mode
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Local API running at http://localhost:${PORT}`));
}