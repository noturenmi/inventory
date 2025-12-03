const swaggerUi = require('swagger-ui-express');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const swaggerFilePath = path.join(__dirname, '..', 'public', 'swagger', 'swagger.json');
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
} catch (err) {
  console.error('Failed to read swagger.json:', err);
}

// Serve Swagger UI
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirect root of this function to Swagger UI
app.get('/api/swagger', (req, res) => res.redirect('/api/swagger/'));

module.exports = app;