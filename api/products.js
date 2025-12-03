const mongoose = require("mongoose");
const { VercelRequest, VercelResponse } = require("@vercel/node");

mongoose.set("strictQuery", false);

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
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

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const products = await Product.find();
      return res.status(200).json(products);
    }
    if (req.method === "POST") {
      const newProduct = new Product(req.body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};