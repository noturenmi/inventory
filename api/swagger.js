export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.0.4",
    info: { title: "Inventory API", version: "1.0.3", description: "Inventory API with products and stock status." },
    servers: [{ url: "https://<your-vercel-domain>" }],
    tags: [
      { name: "products", description: "Operations about products" },
      { name: "inventory", description: "Check stock levels" },
    ],
    paths: {
      "/api/products": {
        get: { tags:["products"], summary:"Get all products" },
        post: { tags:["products"], summary:"Add a new product" }
      },
      "/api/products/{id}": {
        get: { tags:["products"], summary:"Get product by ID" },
        put: { tags:["products"], summary:"Update product by ID" },
        delete: { tags:["products"], summary:"Delete product by ID" }
      },
      "/api/products?action=status": {
        get: { 
          tags:["inventory"], 
          summary:"Check stock levels",
          responses: {
            "200": {
              description: "Inventory status",
              content: {
                "application/json": {
                  example: [
                    { productId: "64f1a1a0...", productName: "Laptop", availableQuantity: 10 },
                    { productId: "64f1a1a1...", productName: "Keyboard", availableQuantity: 50 }
                  ]
                }
              }
            }
          }
        }
      }
    }
  });
}