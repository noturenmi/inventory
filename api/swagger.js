// This is a Vercel serverless function
export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.0.4",
    info: {
      title: "Inventory API",
      version: "1.0.2",
      description: "Inventory API with products, suppliers, orders, and stock status."
    },
    servers: [{ url: "https://zentiels-inventory.vercel.app", description: "Vercel server" }],
    paths: {
      "/products": {
        get: { summary: "Get all products", responses: { "200": { description: "List of products" } } }
      }
    }
  });
}