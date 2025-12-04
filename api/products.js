const mongoose = require('mongoose');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    await connectToDB();
    
    switch (req.method) {
      case 'GET':
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json(products);
        
      case 'POST':
        const newProduct = new Product({
          ...req.body,
          updatedAt: new Date()
        });
        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ 
          error: `Method ${req.method} Not Allowed`,
          allowed: ['GET', 'POST', 'OPTIONS']
        });
    }
  } catch (err) {
    console.error('Products API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;