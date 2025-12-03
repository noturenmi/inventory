const swaggerUi = require('swagger-ui-express');
const express = require('express');
const swaggerDocument = require('../public/swagger/swagger.json');

const router = express();
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
