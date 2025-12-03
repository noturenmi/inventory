import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("✔ Connected to MongoDB"))
    .catch(err => console.error("✖ MongoDB connection error:", err));
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default async function handler(req, res) {
  const { method } = req;
  try {
    switch (method) {
      case "GET":
        if (req.query.id) {
          const product = await Product.findById(req.query.id);
          if (!product) return res.status(404).json({ message: "Product not found" });
          return res.json(product);
        } else {
          const products = await Product.find();
          return res.json(products);
        }
      case "POST":
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json(newProduct);
      case "PUT":
        if (!req.query.id) return res.status(400).json({ message: "Missing product ID" });
        const updated = await Product.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        return res.json(updated);
      case "DELETE":
        if (!req.query.id) return res.status(400).json({ message: "Missing product ID" });
        const deleted = await Product.findByIdAndDelete(req.query.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        return res.json({ message: "Product deleted successfully" });
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
