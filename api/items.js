import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    if (req.method === "GET") {
      const items = await Item.find();
      return res.status(200).json(items);
    }

    if (req.method === "POST") {
      const data = JSON.parse(req.body);
      const newItem = await Item.create(data);
      return res.status(201).json(newItem);
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const data = JSON.parse(req.body);
      const updatedItem = await Item.findByIdAndUpdate(id, data, { new: true });
      if (!updatedItem) return res.status(404).json({ error: "Item not found" });
      return res.status(200).json(updatedItem);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      await Item.findByIdAndDelete(id);
      return res.status(200).json({ message: "Item deleted" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}