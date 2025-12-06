export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, categoryId, quantity, price, description } = req.body;

    if (!name || !categoryId || quantity == null || price == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = {
      _id: '64a6c3b3e4f3b4f00123efgh',
      name,
      categoryId,
      quantity,
      price,
      description: description || '',
    };

    res.status(201).json(newItem);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}