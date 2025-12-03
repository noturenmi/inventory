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

  if (req.method === "GET") {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    } catch {
      return res.status(400).json({ message: "Invalid product data" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}