const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory')
  .then(() => console.log('✔ Connected to MongoDB'))
  .catch(err => console.error('✖ MongoDB connection error:', err));

// --- Mongoose Schemas ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
const Product = mongoose.model('Product', productSchema);

// --- Swagger Spec ---
const swaggerDocument = {
  openapi: "3.0.4",
  info: {
    title: "Inventory API",
    version: "1.0.3",
    description: "Inventory API with products and stock management. Fully documented with examples.",
    contact: { email: "youremail@example.com" },
  },
  servers: [{ url: `http://localhost:${PORT}`, description: "Local server" }],
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
                schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                example: [
                  { id: "1", name: "Laptop", quantity: 10, price: 1200.5 },
                  { id: "2", name: "Keyboard", quantity: 50, price: 25.0 }
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
            "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } }
          }
        },
        responses: {
          "201": { description: "Product created", content: { "application/json": { example: { id: "3", name: "Mouse", quantity: 20, price: 15.0 } } } },
          "400": { description: "Invalid input", content: { "application/json": { example: { code: "400", message: "Invalid product data" } } } }
        }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["products"],
        summary: "Get product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Product found", content: { "application/json": { example: { id: "1", name: "Laptop", quantity: 10, price: 1200.5 } } } },
          "404": { description: "Product not found", content: { "application/json": { example: { code: "404", message: "Product not found" } } } }
        }
      },
      put: {
        tags: ["products"],
        summary: "Update product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } } },
        responses: {
          "200": { description: "Product updated", content: { "application/json": { example: { id: "1", name: "Laptop Pro", quantity: 12, price: 1350.0 } } } },
          "404": { description: "Product not found", content: { "application/json": { example: { code: "404", message: "Product not found" } } } }
        }
      },
      delete: {
        tags: ["products"],
        summary: "Delete product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
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
                schema: { type: "array", items: { $ref: "#/components/schemas/InventoryStatus" } },
                example: [
                  { productId: "1", productName: "Laptop", availableQuantity: 10 },
                  { productId: "2", productName: "Keyboard", availableQuantity: 50 }
                ]
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, quantity: { type: "integer" }, price: { type: "number" } } },
      ProductInput: { type: "object", required: ["name","quantity","price"], properties: { name: { type: "string" }, quantity: { type: "integer" }, price: { type: "number" } } },
      InventoryStatus: { type: "object", properties: { productId: { type: "string" }, productName: { type: "string" }, availableQuantity: { type: "integer" } } },
    }
  }
};

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Routes ---
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs for docs.'));

// Products CRUD
app.get('/products', async (req, res) => {
  try { const products = await Product.find(); res.json(products); }
  catch (err) { res.status(500).json({ code: "500", message: "Internal Server Error" }); }
});

app.get('/products/:id', async (req, res) => {
  try { const product = await Product.findById(req.params.id); if(!product) return res.status(404).json({ code:"404", message:"Product not found" }); res.json(product); }
  catch { res.status(500).json({ code:"500", message:"Internal Server Error" }); }
});

app.post('/products', async (req, res) => {
  try { const { name, quantity, price } = req.body; const newProduct = new Product({name, quantity, price}); await newProduct.save(); res.status(201).json(newProduct); }
  catch { res.status(400).json({ code:"400", message:"Invalid product data" }); }
});

app.put('/products/:id', async (req, res) => {
  try { const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true}); if(!updated) return res.status(404).json({ code:"404", message:"Product not found" }); res.json(updated); }
  catch { res.status(400).json({ code:"400", message:"Invalid product data" }); }
});

app.delete('/products/:id', async (req, res) => {
  try { const deleted = await Product.findByIdAndDelete(req.params.id); if(!deleted) return res.status(404).json({ code:"404", message:"Product not found" }); res.json({ message: "Product deleted successfully" }); }
  catch { res.status(500).json({ code:"500", message:"Internal Server Error" }); }
});

// --- Start server ---
if(process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`✔ Local API running at http://localhost:${PORT}`));
}

// --- Export for Vercel ---
module.exports = app;
