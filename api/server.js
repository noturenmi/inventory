const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB connection error:", err));

// ============================
// ROUTES
// ============================

// Items
app.use("/api/v1/items", require("../routes/items"));

// Categories
app.use("/api/v1/categories", require("../routes/categories"));

// Suppliers
app.use("/api/v1/suppliers", require("../routes/suppliers"));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Swagger JSON at /swagger
app.get("/swagger", (req, res) => {
  res.sendFile(path.join(__dirname, "swagger", "swagger.json"));
});

// Serve Swagger UI and static files
app.use("/swagger", express.static(path.join(__dirname, "swagger")));

// ============================
// DASHBOARD HOMEPAGE
// ============================
app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Inventory API Dashboard</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f4f6f9; margin:0; padding:0; }
                header { background: #2d89ef; color: white; padding: 20px; text-align:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);}
                h1 { margin:0; font-size:28px; }
                .container { max-width: 900px; margin:40px auto; padding:20px; }
                .card { background:white; padding:20px; margin-bottom:20px; border-radius:10px; box-shadow:0 3px 8px rgba(0,0,0,0.1);}
                .card h2 { color: #2d89ef; margin-top:0;}
                ul { list-style:none; padding:0;}
                li { padding:8px 0;}
                a { color:#2d89ef; font-weight:600; text-decoration:none;}
                a:hover { text-decoration:underline;}
                footer { text-align:center; padding:20px; margin-top:40px; color:#777;}
            </style>
        </head>
        <body>
            <header>
                <h1>📦 Inventory System API Dashboard</h1>
                <p>View and test available API endpoints</p>
            </header>

            <div class="container">
                <div class="card">
                    <h2>📁 Items</h2>
                    <ul>
                        <li><a href="/api/v1/items">GET /api/v1/items</a></li>
                        <li>POST /api/v1/items</li>
                        <li>GET /api/v1/items/:id</li>
                        <li>PUT /api/v1/items/:id</li>
                        <li>PATCH /api/v1/items/:id</li>
                        <li>DELETE /api/v1/items/:id</li>
                    </ul>
                </div>

                <div class="card">
                    <h2>📚 Categories</h2>
                    <ul>
                        <li><a href="/api/v1/categories">GET /api/v1/categories</a></li>
                        <li>POST /api/v1/categories</li>
                        <li>DELETE /api/v1/categories/:id</li>
                    </ul>
                </div>

                <div class="card">
                    <h2>🏭 Suppliers</h2>
                    <ul>
                        <li><a href="/api/v1/suppliers">GET /api/v1/suppliers</a></li>
                        <li>POST /api/v1/suppliers</li>
                    </ul>
                </div>
                <div class="card">
                    <h2>📘 API Documentation</h2>
                    <ul>
                        <li><a href="/api-docs">Open Swagger UI</a></li>
                    </ul>
                </div>
            </div>

            <footer>
                Inventory API © ${new Date().getFullYear()}
            </footer>
        </body>
        </html>
    `);
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));