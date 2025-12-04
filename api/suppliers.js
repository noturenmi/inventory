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

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);

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
        const suppliers = await Supplier.find().sort({ name: 1 });
        return res.status(200).json(suppliers);
        
      case 'POST':
        const newSupplier = new Supplier({
          ...req.body,
          updatedAt: new Date()
        });
        const savedSupplier = await newSupplier.save();
        return res.status(201).json(savedSupplier);
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error('Suppliers API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handler;