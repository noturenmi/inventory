const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
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