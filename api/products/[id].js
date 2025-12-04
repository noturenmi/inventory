const mongoose = require('mongoose');  // ❌ CHANGE FROM import
require('dotenv').config();

let conn = null;

const connectToDB = async () => {
  if (conn) return conn;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  conn = await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully'))
    .catch(err => console.error('❌ MongoDB Atlas error:', err.message));
  return conn;
};

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const handler = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { id } = req.query;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  try {
    await connectToDB();
    
    switch (req.method) {
      case 'GET':
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
        
      case 'PUT':
        const updated = await Product.findByIdAndUpdate(
          id, 
          { ...req.body, updatedAt: new Date() }, 
          { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(updated);
        
      case 'DELETE':
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json({ message: 'Product deleted successfully' });
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error('Product ID API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;  // ❌ CHANGE FROM export default