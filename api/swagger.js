{
  "openapi": "3.0.4",
  "info": {
    "title": "Inventory API",
    "version": "1.0.3",
    "description": "Inventory API with products",
    "contact": {
      "email": "youremail@example.com"
    }
  },
  "servers": [
    {
      "url": "/",
      "description": "Vercel serverless root"
    }
  ],
  "tags": [
    {
      "name": "products",
      "description": "Operations about products"
    }
  ],
  "paths": {
    "/products": {
      "get": {
        "tags": ["products"],
        "summary": "Get all products",
        "responses": {
          "200": {
            "description": "List of products"
          }
        }
      },
      "post": {
        "tags": ["products"],
        "summary": "Add a new product",
        "responses": {
          "201": {
            "description": "Product created"
          }
        }
      }
    },
    "/products/{id}": {
      "get": {
        "tags": ["products"],
        "summary": "Get product by ID",
        "responses": {
          "200": {
            "description": "Product found"
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "put": {
        "tags": ["products"],
        "summary": "Update product by ID",
        "responses": {
          "200": {
            "description": "Product updated"
          },
          "404": {
            "description": "Product not found"
          }
        }
      },
      "delete": {
        "tags": ["products"],
        "summary": "Delete product by ID",
        "responses": {
          "200": {
            "description": "Product deleted"
          },
          "404": {
            "description": "Product not found"
          }
        }
      }
    }
  }
}
