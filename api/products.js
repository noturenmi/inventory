const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Only define schema/model once
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// --- CRUD Routes ---
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
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

router.delete('/products/:id', async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

module.exports = router;