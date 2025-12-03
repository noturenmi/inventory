const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();

// Serve the swagger.json
const swaggerFilePath = path.join(__dirname, '..', 'public', 'swagger', 'swagger.json');
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
} catch (err) {
  console.error('Failed to read swagger.json:', err);
}

// Serve Swagger UI at /api/swagger
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Optional: redirect root of this function to Swagger UI
app.get('/api/swagger', (req, res) => res.redirect('/api/swagger/'));

module.exports = app;