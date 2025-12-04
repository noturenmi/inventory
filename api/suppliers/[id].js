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

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', new mongoose.Schema({
  name: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}));

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { id } = req.query;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid supplier ID' });
  }
  
  try {
    await connectToDB();
    
    switch (req.method) {
      case 'GET':
        const supplier = await Supplier.findById(id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        return res.status(200).json(supplier);
        
      case 'PUT':
        const updated = await Supplier.findByIdAndUpdate(
          id, 
          { ...req.body, updatedAt: new Date() }, 
          { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Supplier not found' });
        return res.status(200).json(updated);
        
      case 'DELETE':
        const deleted = await Supplier.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Supplier not found' });
        return res.status(200).json({ message: 'Supplier deleted successfully' });
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Supplier ID API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;