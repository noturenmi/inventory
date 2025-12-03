const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  supplierId: String
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const products = await Product.find();
      return res.status(200).json(products);
    case 'POST':
      const newProduct = new Product(req.body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};