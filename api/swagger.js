import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../public/swagger/swagger.json';
import express from 'express';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;