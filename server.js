const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✔ Connected to MongoDB Atlas'))
.catch(err => console.error('✖ MongoDB connection error:', err));

// Mongoose Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
const Product = mongoose.model('Product', productSchema);

// Swagger spec
const swaggerDocument = {
  openapi: "3.0.4",
  info: {
    title: "Inventory API",
    version: "1.0.3",
    description: "Inventory API for products. Hosted on Vercel + MongoDB Atlas.",
  },
  servers: [{ url: `https://YOUR_VERCEL_URL.vercel.app`, description: "Vercel server" }],
  tags: [{ name: "products", description: "Product operations" }],
  paths: {
    "/products": {
      get: {
        tags: ["products"],
        summary: "Get all products",
        responses: {
          "200": { description: "List of products" }
        }
      },
      post: {
        tags: ["products"],
        summary: "Add a product",
        requestBody: { required: true },
        responses: { "201": { description: "Product created" } }
      }
    },
    "/products/{id}": {
      get: { tags: ["products"], summary: "Get product by ID" },
      put: { tags: ["products"], summary: "Update product by ID" },
      delete: { tags: ["products"], summary: "Delete product by ID" }
    }
  }
};

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs'));

// CRUD routes
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

app.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

app.delete('/products/:id', async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

// Export for Vercel serverless
module.exports = app;

// Optional: run locally
if (require.main === module) {
  app.listen(PORT, () => console.log(`✔ Local API running at http://localhost:${PORT}`));
}