export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;

    const newCategory = {
      _id: '64a6c3b3e4f3b4f00123abcd',
      name: name || 'Default Category'
    };

    res.status(201).json(newCategory);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}