const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();

// Connect MongoDB (Vercel environment must have MONGO_URI set)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose Schema
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});
const Product = mongoose.model('Product', productSchema);

// Routes
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post('/products', async (req, res) => {
  const { name, quantity, price } = req.body;
  const newProduct = new Product({ name, quantity, price });
  await newProduct.save();
  res.status(201).json(newProduct);
});

router.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

router.delete('/products/:id', async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

module.exports = router;