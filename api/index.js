const handler = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // Check if requesting Swagger
  if (req.url === '/swagger' || req.url === '/swagger/') {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
          <script>
            SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui'
            });
          </script>
        </body>
      </html>
    `);
  }
  
  // Regular API response
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