const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

// Swagger JSON
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

// Serve JSON
router.get('/swagger.json', (req, res) => res.json(swaggerDocument));

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;