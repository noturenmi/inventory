// api/swagger.js
export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.0.4",
    info: {
      title: "Inventory API",
      version: "1.0.2",
      description: "Inventory API with products, suppliers, orders, and stock status.",
      contact: { email: "youremail@example.com" },
    },
    servers: [
      { url: "https://<your-vercel-domain>", description: "Vercel server" }
    ],
    tags: [
      { name: "products", description: "Operations about products" },
      { name: "inventory", description: "Check stock levels" },
    ],
    paths: {
      "/products": {
        get: {
          tags: ["products"],
          summary: "Get all products",
          responses: {
            "200": {
              description: "List of products",
              content: {
                "application/json": {
                  example: [
                    { id: 1, name: "Laptop", quantity: 10, price: 1200.5 },
                    { id: 2, name: "Keyboard", quantity: 50, price: 25.0 }
                  ]
                }
              }
            }
          }
        },
        post: {
          tags: ["products"],
          summary: "Add a new product",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { name: "Mouse", quantity: 20, price: 15.0 }
              }
            }
          },
          responses: {
            "201": {
              description: "Product created",
              content: {
                "application/json": {
                  example: { id: 3, name: "Mouse", quantity: 20, price: 15.0 }
                }
              }
            }
          }
        }
      },
      "/products/{id}": {
        get: {
          tags: ["products"],
          summary: "Get product by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            "200": { description: "Product found", content: { "application/json": { example: { id: 1, name: "Laptop", quantity: 10, price: 1200.5 } } } },
            "404": { description: "Product not found", content: { "application/json": { example: { code: "404", message: "Product not found" } } } }
          }
        },
        put: {
          tags: ["products"],
          summary: "Update product by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { example: { name: "Laptop Pro", quantity: 12, price: 1350.0 } }
            }
          },
          responses: {
            "200": { description: "Product updated", content: { "application/json": { example: { id: 1, name: "Laptop Pro", quantity: 12, price: 1350.0 } } } },
            "404": { description: "Product not found", content: { "application/json": { example: { code: "404", message: "Product not found" } } } }
          }
        },
        delete: {
          tags: ["products"],
          summary: "Delete product by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            "200": { description: "Product deleted", content: { "application/json": { example: { message: "Product deleted successfully" } } } },
            "404": { description: "Product not found", content: { "application/json": { example: { code: "404", message: "Product not found" } } } }
          }
        }
      },
      "/inventory/status": {
        get: {
          tags: ["inventory"],
          summary: "Check stock levels",
          responses: {
            "200": {
              description: "Inventory status",
              content: {
                "application/json": {
                  example: [
                    { productId: 1, productName: "Laptop", availableQuantity: 10 },
                    { productId: 2, productName: "Keyboard", availableQuantity: 50 }
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