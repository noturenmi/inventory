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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✔ Connected to MongoDB'))
  .catch(err => console.error('✖ MongoDB connection error:', err.message));

// --- Mongoose Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});
const Product = mongoose.model('Product', productSchema);

// --- Swagger Setup ---
const swaggerDocument = require('./public/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Routes ---
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs for docs.'));

// CRUD routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ code: '500', message: 'Internal Server Error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ code: '404', message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ code: '500', message: 'Internal Server Error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newProduct = new Product({ name, quantity, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch {
    res.status(400).json({ code: '400', message: 'Invalid product data' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ code: '404', message: 'Product not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ code: '400', message: 'Invalid product data' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ code: '404', message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ code: '500', message: 'Internal Server Error' });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`✔ Local API running at http://localhost:${PORT}`));

// --- Export for Vercel ---
module.exports = app;