const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const supplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String
});
const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);

module.exports = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const suppliers = await Supplier.find();
      return res.status(200).json(suppliers);
    case 'POST':
      const newSupplier = new Supplier(req.body);
      await newSupplier.save();
      return res.status(201).json(newSupplier);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};
