# Inventory API  
A Node.js + Express + MongoDB Atlas REST API for managing items, suppliers, categories, and inventory reports — deployed on Vercel with full Swagger documentation.

---

## Live Endpoints

| Feature | URL |
|--------|-----|
| **API Root** | https://zentiels-inventory.vercel.app/ |
| **Swagger Docs** | https://zentiels-inventory.vercel.app/api-docs |
| **API Base URL** | https://zentiels-inventory.vercel.app/api/v1 |

---

## Features

### Items  
- Create new items  
- List all items  
- Get item by ID  
- Update item  
- Delete item  
- Auto-populates supplier reference  

### Suppliers  
- Add supplier  
- List suppliers  

### Categories  
- Get distinct categories  

### Reports  
- Inventory summary  
- Total stock  
- Total value  
- Category breakdown  
- Low stock list  

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Docs | Swagger UI (OpenAPI 3) |
| Deployment | Vercel |
| ORM | Mongoose |

---

## Project Structure

project/
│ server.js
│ package.json
│ swagger.json
│ .env


---

## Installation & Setup

### 1. Clone repository
```bash
git clone https://github.com/noturenmi/inventory.git
cd inventory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 4. Run server locally
```bash
npm start
```

Local environment:
- API: http://localhost:3000/api/v1
- Swagger Docs: http://localhost:3000/api-docs

## API Reference
**Base URL**
```bash
/api/v1
```

## ITEMS
**Get all items**
```bash
GET /api/v1/items
```
**Create new item**
```bash
POST /api/v1/items
```
**Get item by ID**
```bash
GET /api/v1/items/:id
```
**Update item**
```bash
PUT /api/v1/items/:id
```
**Delete item**
```bash
DELETE /api/v1/items/:id
```

## SUPPLIERS
**Get all suppliers**
```bash
GET /api/v1/suppliers
```
**Create new supplier**
```bash
POST /api/v1/suppliers
```

## CATEGORIES
**Get distinct categories**
```bash
GET /api/v1/categories
```

## REPORTS
**Get inventory summary**
```bash
GET /api/v1/reports/inventory
```

## Swagger Docs
```bash
/api/v1/swagger.json
```


## Deploying on Vercel
**1. Push code to GitHub**

Make sure server.js, package.json, swagger.json are included.

**2. Go to Vercel → "Add New Project"**

Import your GitHub repo.

**3. Add Environment Variables**

Settings → Environment Variables:
| Key | Value |
|-------|------------|
| MONGODB_URI | your MongoDB Atlas URL |

**4. Deploy**
Vercel auto-builds and hosts the API.
