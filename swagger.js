module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Inventory API",
    version: "1.0.0",
    description: "API documentation for Inventory Management System (Items, Suppliers, Reports)"
  },
  servers: [
    {
      url: "https://zentiels-inventory.vercel.app/api/v1",
      description: "Vercel Server"
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Localhost Server"
    }
  ],
  paths: {
    "/items": {
      get: {
        summary: "Get all items",
        tags: ["Items"],
        responses: {
          200: {
            description: "List of items"
          }
        }
      },
      post: {
        summary: "Create new item",
        tags: ["Items"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  stock: { type: "number" },
                  price: { type: "number" },
                  supplier: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Item created" },
          400: { description: "Validation error" }
        }
      }
    },

    "/items/{id}": {
      get: {
        summary: "Get item by ID",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Item details" }, 404: { description: "Item not found" } }
      },
      put: {
        summary: "Update item",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Item updated" }, 404: { description: "Item not found" } }
      },
      delete: {
        summary: "Delete item",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Item deleted" }, 404: { description: "Item not found" } }
      }
    },

    "/suppliers": {
      get: {
        summary: "Get all suppliers",
        tags: ["Suppliers"],
        responses: { 200: { description: "List of suppliers" } }
      },
      post: {
        summary: "Create supplier",
        tags: ["Suppliers"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  contact: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  address: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Supplier created" } }
      }
    },

    "/categories": {
      get: {
        summary: "Get all categories",
        tags: ["Categories"],
        responses: { 200: { description: "List of categories" } }
      }
    },

    "/reports/inventory": {
      get: {
        summary: "Generate inventory summary report",
        tags: ["Reports"],
        responses: { 200: { description: "Inventory report" } }
      }
    }
  }
};
