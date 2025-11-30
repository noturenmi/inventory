const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  const { method, query, body } = req;

  try {
    if (method === 'GET' && query.id) {
      const product = await Product.findById(query.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.json(product);
    }

    if (method === 'GET') {
      const products = await Product.find();
      return res.json(products);
    }

    if (method === 'POST') {
      const newProduct = new Product(body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    }

    if (method === 'PUT' && query.id) {
      const updated = await Product.findByIdAndUpdate(query.id, body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: "Product not found" });
      return res.json(updated);
    }

    if (method === 'DELETE' && query.id) {
      const deleted = await Product.findByIdAndDelete(query.id);
      if (!deleted) return res.status(404).json({ message: "Product not found" });
      return res.json({ message: "Product deleted successfully" });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
