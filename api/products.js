// Inside /api/products.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, quantity, price, stock } = req.body;

      if (!name || quantity == null || price == null || stock == null) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newProduct = new Product({ name, quantity, price, stock });
      await newProduct.save();
      return res.status(201).json(newProduct);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid product data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}