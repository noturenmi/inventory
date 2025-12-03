const mongoose = require('mongoose');
const { json } = require('express');
require('dotenv').config();

let conn = null;

const connectToDB = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return conn;
};

const handler = async (req, res) => {
  await connectToDB();

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  });

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const product = await Product.findById(req.query.id);
          if (!product) return res.status(404).json({ message: "Not found" });
          return res.json(product);
        } else {
          const products = await Product.find();
          return res.json(products);
        }
      case 'POST':
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json(newProduct);
      case 'PUT':
        const updated = await Product.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.json(updated);
      case 'DELETE':
        const deleted = await Product.findByIdAndDelete(req.query.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        return res.json({ message: "Deleted successfully" });
      default:
        res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = handler;
