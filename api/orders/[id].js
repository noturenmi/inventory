const mongoose = require('mongoose');
require('dotenv').config();

let conn = null;

const connectToDB = async () => {
  if (conn) return conn;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return conn;
};

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  orderNumber: String,
  products: Array,
  totalAmount: Number,
  status: String,
  customerName: String,
  customerEmail: String,
  createdAt: Date,
  updatedAt: Date
}));

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { id } = req.query;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }
  
  try {
    await connectToDB();
    
    switch (req.method) {
      case 'GET':
        const order = await Order.findById(id).populate('products.productId');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json(order);
        
      case 'PUT':
        const updated = await Order.findByIdAndUpdate(
          id, 
          { ...req.body, updatedAt: new Date() }, 
          { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json(updated);
        
      case 'DELETE':
        const deleted = await Order.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json({ message: 'Order deleted successfully' });
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Order ID API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;