import mongoose from "mongoose";

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside Vercel.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Mongoose Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Helper to parse request body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => resolve(JSON.parse(body || "{}")));
    req.on("error", reject);
  });
}

// Main handler
export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        if (query.id) {
          const product = await Product.findById(query.id);
          if (!product) return res.status(404).json({ message: "Product not found" });
          return res.status(200).json(product);
        } else {
          const products = await Product.find();
          return res.status(200).json(products);
        }

      case "POST":
        const postData = await parseBody(req);
        const newProduct = new Product(postData);
        await newProduct.save();
        return res.status(201).json(newProduct);

      case "PUT":
        if (!query.id) return res.status(400).json({ message: "Missing product ID" });
        const putData = await parseBody(req);
        const updated = await Product.findByIdAndUpdate(query.id, putData, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(updated);

      case "DELETE":
        if (!query.id) return res.status(400).json({ message: "Missing product ID" });
        const deleted = await Product.findByIdAndDelete(query.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
