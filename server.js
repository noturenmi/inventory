const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (IMPORTANT)
app.use(express.static("public"));

// --- MongoDB Connection ---
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch(err => console.error("✖ MongoDB connection error:", err));
}

// --- Mongoose Schema ---
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// --- Routes ---
app.get("/", (req, res) => {
  res.send("📦 Inventory API is running! Visit /api-docs for documentation.");
});

// Products Endpoints
app.get("/products", async (req, res) => {
  const items = await Product.find();
  res.json(items);
});

app.get("/products/:id", async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(item);
});

app.post("/products", async (req, res) => {
  const newItem = new Product(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

app.put("/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

app.delete("/products/:id", async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

// --- Swagger ---
const swaggerJsonPath = path.join(__dirname, "public/swagger/swagger.json");
const swaggerDocument = require(swaggerJsonPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Export for Vercel ---
module.exports = app;