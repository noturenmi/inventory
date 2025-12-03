module.exports = (req, res) => {
  const swaggerDocument = {
    openapi: "3.0.4",
    info: {
      title: "Inventory Management API",
      version: "1.0.1",
      description: "Inventory API documentation for Vercel deployment"
    },
    servers: [
      { url: "/", description: "Vercel serverless root" }
    ],
    paths: {
      "/api/products": {
        get: { summary: "Get all products" },
        post: { summary: "Create a new product" }
      }
    },
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            name: { type: "string" },
            quantity: { type: "integer" },
            price: { type: "number" }
          },
          required: ["name", "quantity", "price"]
        }
      }
    }
  };
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(swaggerDocument);
};