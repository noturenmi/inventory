export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone } = req.body;

    const newSupplier = {
      _id: '64a6c3b3e4f3b4f00123ijkl',
      name: name || 'Default Supplier',
      email: email || 'supplier@default.com',
      phone: phone || '+123456789'
    };

    res.status(201).json(newSupplier);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}