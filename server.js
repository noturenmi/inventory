const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Load OpenAPI YAML ---
const swaggerDocument = YAML.load('./inventory-openapi.yaml'); // <- your inventory OpenAPI file

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('Inventory API running!'));

// --- Dummy Data ---
let products = [
  { id: 101, name: "Laptop", description: "15-inch gaming laptop", quantity: 25, supplierId: 5 },
  { id: 102, name: "Mouse", description: "Wireless mouse", quantity: 50, supplierId: 5 }
];

let suppliers = [
  { id: 5, name: "Tech Supplies Inc.", email: "contact@techsupplies.com", phone: "09171234567" }
];

let orders = [
  { id: 2001, productId: 101, quantity: 2, status: "pending" }
];

let users = [
  { id: 1, username: "admin", email: "admin@example.com", password: "password" }
];

// --- PRODUCTS ---
// Get all products
app.get('/api/v1/products', (req, res) => {
  res.json(products);
});

// Create product
app.post('/api/v1/products', (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.json(product);
});

// Get product by ID
app.get('/api/v1/products/:productId', (req, res) => {
  const product = products.find(p => p.id == req.params.productId);
  product ? res.json(product) : res.status(404).json({ code: "404", message: "Product not found" });
});

// Update product
app.put('/api/v1/products/:productId', (req, res) => {
  let product = products.find(p => p.id == req.params.productId);
  if (product) {
    Object.assign(product, req.body);
    res.json(product);
  } else {
    res.status(404).json({ code: "404", message: "Product not found" });
  }
});

// Delete product
app.delete('/api/v1/products/:productId', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.productId);
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ code: "404", message: "Product not found" });
  }
});

// Low-stock products
app.get('/api/v1/products/low-stock', (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;
  const lowStock = products.filter(p => p.quantity <= threshold);
  res.json(lowStock);
});

// Restock product
app.patch('/api/v1/products/:productId/restock', (req, res) => {
  const product = products.find(p => p.id == req.params.productId);
  const { quantity } = req.body;
  if (!product) return res.status(404).json({ code: "404", message: "Product not found" });
  if (!quantity || quantity <= 0) return res.status(400).json({ code: "400", message: "Invalid quantity" });
  product.quantity += quantity;
  res.json(product);
});

// --- SUPPLIERS ---
// Get all suppliers
app.get('/api/v1/suppliers', (req, res) => res.json(suppliers));

// Create supplier
app.post('/api/v1/suppliers', (req, res) => {
  const supplier = { id: Date.now(), ...req.body };
  suppliers.push(supplier);
  res.json(supplier);
});

// Get supplier by ID
app.get('/api/v1/suppliers/:supplierId', (req, res) => {
  const supplier = suppliers.find(s => s.id == req.params.supplierId);
  supplier ? res.json(supplier) : res.status(404).json({ code: "404", message: "Supplier not found" });
});

// Update supplier
app.put('/api/v1/suppliers/:supplierId', (req, res) => {
  let supplier = suppliers.find(s => s.id == req.params.supplierId);
  if (supplier) {
    Object.assign(supplier, req.body);
    res.json(supplier);
  } else {
    res.status(404).json({ code: "404", message: "Supplier not found" });
  }
});

// Delete supplier
app.delete('/api/v1/suppliers/:supplierId', (req, res) => {
  const index = suppliers.findIndex(s => s.id == req.params.supplierId);
  if (index !== -1) {
    suppliers.splice(index, 1);
    res.json({ message: "Supplier deleted" });
  } else {
    res.status(404).json({ code: "404", message: "Supplier not found" });
  }
});

// Get products by supplier
app.get('/api/v1/suppliers/:supplierId/products', (req, res) => {
  const supplier = suppliers.find(s => s.id == req.params.supplierId);
  if (!supplier) return res.status(404).json({ code: "404", message: "Supplier not found" });
  const suppliedProducts = products.filter(p => p.supplierId == supplier.id);
  res.json(suppliedProducts);
});

// --- ORDERS ---
// Get all orders
app.get('/api/v1/orders', (req, res) => res.json(orders));

// Create order
app.post('/api/v1/orders', (req, res) => {
  const order = { id: Date.now(), ...req.body };
  orders.push(order);
  res.json(order);
});

// --- USERS ---
// Get all users
app.get('/api/v1/users', (req, res) => res.json(users));

// Create user
app.post('/api/v1/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.json(user);
});

app.listen(PORT, () => console.log(`Inventory API running on port ${PORT}`));