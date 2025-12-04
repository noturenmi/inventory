# Inventory Management API  
A RESTful API for managing inventory, products, and orders built with Node.js, Express, and MongoDB Atlas, deployed on Vercel.

---

## Live Demo
- **API URL**: https://zentiels-inventory.vercel.app
- **Documentation**: https://zentiels-inventory.vercel.app/api-docs
- **GitHub**: https://github.com/noturenmi/inventory

---

## Features
-  Complete CRUD operations for Products
-  Order management system
-  MongoDB Atlas integration
-  Swagger/OpenAPI documentation
-  CORS enabled for cross-origin requests
-  Deployed on Vercel (serverless)
-  Environment-based configuration
 
## API Endpoints

GET /
Check if API is running.

---

### Products
GET /api/products - Get all products

GET /api/products/{id} - Get product by ID

POST /api/products - Create new product

PUT /api/products/{id} - Update product

DELETE /api/products/{id} - Delete product

---

### Orders

GET /api/orders - Get all orders

GET /api/orders/{id} - Get order by ID

POST /api/orders - Create new order

PUT /api/orders/{id} - Update order

DELETE /api/orders/{id} - Delete order

---

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Swagger UI Express** - API documentation
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **Vercel** - Deployment platform

## Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/noturenmi/inventory.git
cd inventory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```evn
PORT=3000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
```

### 4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access the API
- API: http://localhost:3000
- Documentation: http://localhost:3000/api-docs

---

### API Usage Examples

## Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "quantity": 50,
    "price": 29.99,
    "stock": 50
  }'
```

## Get All Products
```bash
curl -X GET http://localhost:3000/api/products
```

### API Usage Examples

## Get All Products
```bash
curl -X GET http://localhost:3000/api/products
```

## Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_1",
    "quantity": 2,
    "customerName": "John Doe",
    "customerEmail": "john@example.com"
  }'
```

### Data Models

## Product
```json
{
  "_id": "string",
  "name": "string",
  "quantity": "number",
  "price": "number",
  "stock": "number",
  "createdAt": "date"
}
```

## Order
```json
{
  "_id": "string",
  "orderId": "string",
  "productId": "string",
  "productName": "string",
  "quantity": "number",
  "totalPrice": "string",
  "customerName": "string",
  "customerEmail": "string",
  "status": "string",
  "createdAt": "date"
}
```

---

### Deployment

## Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
    - MONGO_URI: Your MongoDB Atlas connection string
4. Deploy automatically on push

## Vercel Configuration
The project includes vercel.json for serverless deployment:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

### Documentation
- Interactive API documentation available at /api-docs
- Built with Swagger UI
- OpenAPI 3.0 specification in public/swagger/swagger.json

---

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `MONGO_URI` | MongoDB Atlas connection string | Yes | - |
| `NODE_ENV` | Environment mode (`development`/`production`) | No | `development` |

---

### Troubleshooting

## Vercel Configuration
1. MongoDB Connection Error
     - Check if MONGO_URI is correct in .env
     - Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
     - Ensure internet connection
2. CORS Errors
      - API includes CORS headers for all origins
      - Check browser console for specific errors
3. 404 Errors in Vercel
      - Ensure vercel.json is present
      - Check server.js exports correctly
      - Verify routes are defined
4. Swagger UI Not Loading
      - Check if public/swagger/swagger.json exists
      - Verify JSON syntax is valid

---

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

### License
This project is licensed under the **ISC License**.

See the [LICENSE](LICENSE) file for details.

---

### Star this repo if you found it useful!

## **Key Sections Included:**

1. **Live Demo Links** - Direct links to your deployed API
2. **Features** - Highlight what your API does
3. **API Endpoints** - Clear listing of all routes
4. **Tech Stack** - Technologies used
5. **Installation Guide** - Step-by-step setup
6. **Usage Examples** - curl commands for testing
7. **Data Models** - JSON structure examples
8. **Deployment Guide** - Vercel specific instructions
9. **Troubleshooting** - Common issues and solutions
10. **Contributing & License** - Standard GitHub sections

**Save this as `README.md`** in your project root. It's professional, informative, and helps users understand and use your API easily!
