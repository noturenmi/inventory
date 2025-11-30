const { join } = require('path');
const fs = require('fs');
const swaggerUiDist = require('swagger-ui-dist');

const swaggerDocument = {
  openapi: "3.0.4",
  info: {
    title: "Inventory API",
    version: "1.0.3",
    description: "Inventory API with products and stock status",
    contact: { email: "youremail@example.com" },
  },
  servers: [{ url: "/", description: "Vercel serverless root" }],
  paths: {
    "/products": {
      get: { tags: ["products"], summary: "Get all products" },
      post: { tags: ["products"], summary: "Add a new product" }
    },
    "/products/{id}": {
      get: { tags: ["products"], summary: "Get product by ID" },
      put: { tags: ["products"], summary: "Update product by ID" },
      delete: { tags: ["products"], summary: "Delete product by ID" }
    }
  }
};

// Export the Vercel function
module.exports = async (req, res) => {
  const { url } = req;

  // Serve Swagger JSON
  if (url === '/api/swagger.json') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(swaggerDocument, null, 2));
  }

  // Serve Swagger UI
  const swaggerHtmlPath = join(swaggerUiDist.getAbsoluteFSPath(), 'index.html');
  let html = fs.readFileSync(swaggerHtmlPath, 'utf8');

  // Inject URL for our JSON spec
  html = html.replace('https://petstore.swagger.io/v2/swagger.json', '/api/swagger.json');

  res.setHeader('Content-Type', 'text/html');
  return res.end(html);
};