const express = require('express');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const swaggerDocument = {
  openapi: "3.0.4",
  info: {
    title: "Inventory API",
    version: "1.0.3",
    description: "Inventory API with products and stock status",
    contact: { email: "youremail@example.com" },
  },
  servers: [{ url: "/", description: "Vercel serverless root" }],
  tags: [{ name: "products", description: "Operations about products" }],
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

// Swagger JSON
router.get('/swagger.json', (req, res) => res.json(swaggerDocument));

// Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;