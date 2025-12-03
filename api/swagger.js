module.exports = (req, res) => {
  const swaggerDocument = {
    openapi: "3.0.4",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description:
        "A simple Inventory Management API that allows creating, reading, updating, and deleting products. Includes stock tracking and pricing.",
      contact: {
        name: "API Support",
        email: "youremail@example.com"
      }
    },

    servers: [
      { url: "/", description: "Vercel Serverless Deployment" }
    ],

    tags: [
      { name: "Products", description: "Product inventory operations" }
    ],

    paths: {
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Get all products",
          description: "Returns a list of all products in the inventory.",
          responses: {
            200: {
              description: "List of products",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" }
                  }
                }
              }
            }
          }
        },

        post: {
          tags: ["Products"],
          summary: "Create a new product",
          description: "Adds a new product to the inventory.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" }
              }
            }
          },
          responses: {
            201: {
              description: "Product created successfully",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } }
              }
            }
          }
        }
      },

      "/api/products?id={id}": {
        get: {
          tags: ["Products"],
          summary: "Get product by ID",
          description: "Retrieves a single product using its unique ID.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: {
              description: "Product details",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } }
            },
            404: { description: "Product not found" }
          }
        },

        put: {
          tags: ["Products"],
          summary: "Update a product",
          description: "Updates an existing product using its ID.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } }
            }
          },
          responses: {
            200: {
              description: "Product successfully updated",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } }
              }
            },
            404: { description: "Product not found" }
          }
        },

        delete: {
          tags: ["Products"],
          summary: "Delete a product",
          description: "Deletes a product using its ID.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: { description: "Product deleted successfully" },
            404: { description: "Product not found" }
          }
        }
      }
    },

    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "67a45b91f8209b341ed2cc01" },
            name: { type: "string", example: "Wireless Mouse" },
            quantity: { type: "number", example: 50 },
            price: { type: "number", example: 750 }
          }
        },

        ProductInput: {
          type: "object",
          required: ["name", "quantity", "price"],
          properties: {
            name: { type: "string", example: "Keyboard" },
            quantity: { type: "number", example: 20 },
            price: { type: "number", example: 999 }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      }
    }
  };

  res.status(200).json(swaggerDocument);
};