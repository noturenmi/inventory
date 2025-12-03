const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✔ Connected to MongoDB'))
.catch(err => console.error('✖ MongoDB connection error:', err));

// --- Mongoose Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true } // added field
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// --- Routes ---
// Home
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs for docs.'));

// Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- Swagger Setup ---
const swaggerDocument = require('./public/swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Start server locally ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`Local API running at http://localhost:${PORT}`));
}

module.exports = app; // Keep this for Vercel