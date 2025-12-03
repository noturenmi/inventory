const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./api/products');

const app = express();
app.use(cors());
app.use(express.json());

// Mount the API routes
app.use('/api', productsRouter);

// Home route
app.get('/', (req, res) => res.send('📦 Inventory API running! Visit /swagger/ for docs.'));

module.exports = app;