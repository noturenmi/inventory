const handler = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Return JSON for API clients
  res.status(200).json({ 
    message: "📦 Inventory API running!",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      suppliers: "/api/suppliers",
      docs: "/swagger"
    },
    status: "online",
    timestamp: new Date().toISOString()
  });
};

module.exports = handler;