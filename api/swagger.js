export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.0.4",
    info: { title: "Inventory API", version: "1.0.2", description: "Inventory API with products, suppliers, orders, stock status." },
    servers: [{ url: "https://https://zentiels-inventory.vercel.app" }],
    tags: [{ name: "products", description: "Operations about products" }],
    paths: {
      "/api/products": {
        get: { tags:["products"], summary:"Get all products" },
        post: { tags:["products"], summary:"Add a new product" }
      },
      "/api/products/{id}": {
        get: { tags:["products"], summary:"Get product by ID" },
        put: { tags:["products"], summary:"Update product by ID" },
        delete: { tags:["products"], summary:"Delete product by ID" }
      }
    }
  });
}