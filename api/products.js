import mongoose from 'mongoose';

let Product;

// Connect MongoDB
const connectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  if (!Product) {
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true }
    });
    Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  }
};

export default async function handler(req, res) {
  await connectDb();

  const { method } = req;

  if (method === 'GET') {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  if (method === 'POST') {
    const { name, quantity, price, stock } = req.body;
    if (!name || quantity == null || price == null || stock == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newProduct = new Product({ name, quantity, price, stock });
    await newProduct.save();
    return res.status(201).json(newProduct);
  }

  if (method === 'PUT' || method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Missing product ID' });

    if (method === 'PUT') {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(updated);
    }

    if (method === 'DELETE') {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product deleted successfully' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}