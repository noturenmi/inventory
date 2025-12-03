const mongoose = require('mongoose');
const { json } = require('micro'); // for Vercel serverless
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

let Product;

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    });
    Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  }
}

// Serverless handler
module.exports = async (req, res) => {
  await connectDB();

  const { method, query } = req;

  if (method === 'GET' && !query.id) {
    const products = await Product.find();
    res.status(200).json(products);
  } else if (method === 'GET' && query.id) {
    const product = await Product.findById(query.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } else if (method === 'POST') {
    const body = await json(req);
    const newProduct = new Product(body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } else if (method === 'PUT' && query.id) {
    const body = await json(req);
    const updated = await Product.findByIdAndUpdate(query.id, body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updated);
  } else if (method === 'DELETE' && query.id) {
    const deleted = await Product.findByIdAndDelete(query.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};