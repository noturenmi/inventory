export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, categoryId, quantity, price, description } = req.body;

    const newItem = {
      _id: '64a6c3b3e4f3b4f00123efgh',
      name: name || 'Default Item',
      categoryId: categoryId || 'defaultCategoryId',
      quantity: quantity || 0,
      price: price || 0,
      description: description || ''
    };

    res.status(201).json(newItem);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}