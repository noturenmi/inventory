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

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

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
        const orders = await Order.find().populate('products.productId').sort({ createdAt: -1 });
        return res.status(200).json(orders);
        
      case 'POST':
        const newOrder = new Order({
          ...req.body,
          updatedAt: new Date()
        });
        const savedOrder = await newOrder.save();
        return res.status(201).json(savedOrder);
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error('Orders API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;