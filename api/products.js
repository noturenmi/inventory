import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory';

// --- Connect to MongoDB once ---
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Mongoose Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// --- Handler ---
export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const { id, action } = req.query; // action can be 'status' for inventory

  try {
    // --- Inventory status ---
    if (method === 'GET' && action === 'status') {
      const products = await Product.find({}, { name: 1, quantity: 1 }); // only id, name, quantity
      const inventory = products.map(p => ({
        productId: p._id,
        productName: p.name,
        availableQuantity: p.quantity
      }));
      return res.json(inventory);
    }

    switch (method) {
      case 'GET':
        if (id) {
          const product = await Product.findById(id);
          if (!product) return res.status(404).json({ code: "404", message: "Product not found" });
          return res.json(product);
        } else {
          const products = await Product.find();
          return res.json(products);
        }

      case 'POST':
        const { name, quantity, price } = req.body;
        const newProduct = new Product({ name, quantity, price });
        await newProduct.save();
        return res.status(201).json(newProduct);

      case 'PUT':
        if (!id) return res.status(400).json({ code: "400", message: "Product ID required" });
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ code: "404", message: "Product not found" });
        return res.json(updated);

      case 'DELETE':
        if (!id) return res.status(400).json({ code: "400", message: "Product ID required" });
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ code: "404", message: "Product not found" });
        return res.json({ message: "Product deleted successfully" });

      default:
        res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "500", message: "Internal Server Error" });
  }
}