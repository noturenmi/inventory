import mongoose from "mongoose";

const Product = mongoose.models.Product || mongoose.model(
  "Product",
  new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  })
);

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export default async function handler(req, res) {
  await connect();

  const { id } = req.query;

  if (req.method === "GET") {
    const product = await Product.findById(id);
    return product
      ? res.status(200).json(product)
      : res.status(404).json({ message: "Product not found" });
  }

  if (req.method === "PUT") {
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      return updated
        ? res.status(200).json(updated)
        : res.status(404).json({ message: "Product not found" });
    } catch {
      return res.status(400).json({ message: "Invalid product data" });
    }
  }

  if (req.method === "DELETE") {
    const deleted = await Product.findByIdAndDelete(id);
    return deleted
      ? res.status(200).json({ message: "Product deleted" })
      : res.status(404).json({ message: "Product not found" });
  }

  res.status(405).json({ message: "Method not allowed" });
}