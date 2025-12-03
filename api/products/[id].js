import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

if (!global.mongoose) {
  global.mongoose = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default async function handler(req, res) {
  await global.mongoose;

  const { id } = req.query;
  const { method } = req;

  try {
    if (method === "GET") {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(product);
    }

    if (method === "PUT") {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);
    }

    if (method === "DELETE") {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted successfully" });
    }

    res.status(405).json({ message: "Not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
