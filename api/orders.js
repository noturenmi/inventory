const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const orderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const orders = await Order.find();
      return res.status(200).json(orders);
    case 'POST':
      const newOrder = new Order(req.body);
      await newOrder.save();
      return res.status(201).json(newOrder);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};