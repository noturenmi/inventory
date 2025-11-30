const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✔ Connected to MongoDB'))
.catch(err => console.error('✖ MongoDB connection error:', err));

// --- Mongoose Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
const Product = mongoose.model('Product', productSchema);

// --- Swagger JSON ---
const swaggerDocument = {
  openapi: "3.0.4",
  info: {
    title: "Inventory API",
    version: "1.0.3",
    description: "Inventory API with products and stock status",
    contact: { email: "youremail@example.com" },
  },
  servers: [{ url: "/", description: "Vercel serverless root" }],
  paths: {
    "/products": {
      get: { tags: ["products"], summary: "Get all products" },
      post: { tags: ["products"], summary: "Add a new product" }
    },
    "/products/{id}": {
      get: { tags: ["products"], summary: "Get product by ID" },
      put: { tags: ["products"], summary: "Update product by ID" },
      delete: { tags: ["products"], summary: "Delete product by ID" }
    }
  }
};

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Routes ---

// Home
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api/api-docs for docs.'));

// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Create new product
app.post('/products', async (req, res) => {
  const { name, quantity, price } = req.body;
  const newProduct = new Product({ name, quantity, price });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Update product
app.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

// --- Export for Vercel ---
module.exports = app;