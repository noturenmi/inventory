const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // Return HTML for root, JSON for /api
  if (req.url === '/' || req.url === '') {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>📦 Inventory API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .status { color: green; font-weight: bold; }
          .endpoints { text-align: left; display: inline-block; margin: 20px; }
          .endpoint { margin: 10px 0; }
          .btn { display: inline-block; padding: 10px 20px; margin: 10px; 
                 background: #0070f3; color: white; text-decoration: none; 
                 border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📦 Inventory Management API</h1>
          <p class="status">✅ API is online and running</p>
          <p>Welcome to the Inventory API! This API helps manage products, orders, and suppliers.</p>
          
          <div class="endpoints">
            <h3>Available Endpoints:</h3>
            <div class="endpoint">📦 <b>Products:</b> <a href="/api/products">/api/products</a></div>
            <div class="endpoint">📋 <b>Orders:</b> <a href="/api/orders">/api/orders</a></div>
            <div class="endpoint">🏢 <b>Suppliers:</b> <a href="/api/suppliers">/api/suppliers</a></div>
            <div class="endpoint">📚 <b>Documentation:</b> <a href="/swagger">/swagger</a></div>
          </div>
          
          <div style="margin-top: 30px;">
            <a href="/swagger" class="btn">View Full Documentation</a>
            <a href="https://github.com/noturenmi/inventory" class="btn">GitHub Repository</a>
          </div>
          
          <p style="margin-top: 40px; color: #666;">
            Last checked: ${new Date().toLocaleString()}
          </p>
        </div>
      </body>
      </html>
    `);
  }
  
  // JSON response for API clients
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