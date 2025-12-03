const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Connect to MongoDB only once per serverless instance
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// Define Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Serverless handler
module.exports = async (req, res) => {
  const { method, query, body } = req;
  const { id } = query;

  try {
    switch (method) {
      case "GET":
        if (id) {
          const product = await Product.findById(id);
          if (!product) return res.status(404).json({ message: "Product not found" });
          return res.status(200).json(product);
        }
        const products = await Product.find();
        return res.status(200).json(products);

      case "POST":
        const newProduct = new Product(body);
        await newProduct.save();
        return res.status(201).json(newProduct);

      case "PUT":
        if (!id) return res.status(400).json({ message: "Product ID required" });
        const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(updated);

      case "DELETE":
        if (!id) return res.status(400).json({ message: "Product ID required" });
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};