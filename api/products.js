const mongoose = require("mongoose");

let cachedDb = null; // prevent multiple connections in serverless env

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "inventory",
  });
  cachedDb = conn;
  return conn;
}

module.exports = async (req, res) => {
  await connectToDatabase();

  // Mongoose model
  const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }));

  const { method } = req;

  try {
    if (method === "GET") {
      if (req.query.id) {
        const product = await Product.findById(req.query.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.json(product);
      }
      const products = await Product.find();
      return res.json(products);
    }

    if (method === "POST") {
      const { name, quantity, price } = req.body;
      const newProduct = await Product.create({ name, quantity, price });
      return res.status(201).json(newProduct);
    }

    if (method === "PUT") {
      const { id, ...update } = req.body;
      const updated = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: "Product not found" });
      return res.json(updated);
    }

    if (method === "DELETE") {
      const { id } = req.query;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Product not found" });
      return res.json({ message: "Product deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
