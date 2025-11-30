const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./api/products');
const swaggerRouter = require('./api/swagger');

const app = express();
app.use(express.json());
app.use(cors());

// --- MongoDB Connection ---
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✔ Connected to MongoDB'))
  .catch(err => console.error('✖ MongoDB connection error:', err));
}

// --- Routes ---
app.use('/', productsRouter);
app.use('/', swaggerRouter);

// Home
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /api-docs for docs.'));

// --- Start server locally ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local API running at http://localhost:${PORT}`));
}

// --- Export app for Vercel ---
module.exports = app;