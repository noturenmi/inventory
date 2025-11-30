const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory')
  .then(() => console.log('✔ Connected to MongoDB'))
  .catch(err => console.error('✖ MongoDB connection error:', err));

// --- Mongoose Schemas ---
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
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          quantity: { type: "number" },
          price: { type: "number" }
        }
      }
    }
  }
};

// --- Serve Swagger JSON ---
app.get('/api/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, async (req, res, next) => {
  const swaggerUrl = '/api/swagger.json';
  swaggerUi.setup(swaggerDocument)(req, res, next);
});

// --- Routes ---
// Home
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs'));

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ code: "500", message: "Internal Server Error" });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ code: "404", message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ code: "500", message: "Internal Server Error" });
  }
});

// Create product
app.post('/products', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newProduct = new Product({ name, quantity, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch {
    res.status(400).json({ code: "400", message: "Invalid product data" });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ code: "404", message: "Product not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ code: "400", message: "Invalid product data" });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ code: "404", message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ code: "500", message: "Internal Server Error" });
  }
});

// --- Start server locally ---
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`✔ Local API running at http://localhost:${PORT}`));
}

// --- Export for Vercel ---
module.exports = app;