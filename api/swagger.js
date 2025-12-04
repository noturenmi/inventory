const handler = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "Swagger documentation available at:",
      endpoints: {
        ui: "/swagger",
        json: "/swagger.json",
        api_docs: "/api-docs"
      },
      note: "Visit /swagger for interactive API documentation"
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};

module.exports = handler;