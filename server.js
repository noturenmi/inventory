const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB Connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send(`
        <h1>Inventory API</h1>
        <p>Available Endpoints:</p>

        <h2>Items</h2>
        <ul>
            <li><a href="/api/v1/items">GET /api/v1/items</a></li>
            <li>POST /api/v1/items</li>
            <li>GET /api/v1/items/:id</li>
            <li>PUT /api/v1/items/:id</li>
            <li>PATCH /api/v1/items/:id</li>
            <li>DELETE /api/v1/items/:id</li>
        </ul>

        <h2>Categories</h2>
        <ul>
            <li><a href="/api/v1/categories">GET /api/v1/categories</a></li>
            <li>POST /api/v1/categories</li>
            <li>DELETE /api/v1/categories/:id</li>
        </ul>

        <h2>Suppliers</h2>
        <ul>
            <li><a href="/api/v1/suppliers">GET /api/v1/suppliers</a></li>
            <li>POST /api/v1/suppliers</li>
        </ul>

        <h2>Stock</h2>
        <ul>
            <li>GET /api/v1/stock/:itemId</li>
            <li>PATCH /api/v1/stock/:itemId</li>
        </ul>

        <h2>Reports</h2>
        <ul>
            <li><a href="/api/v1/reports/inventory">GET /api/v1/reports/inventory</a></li>
        </ul>

        <h2>Documentation</h2>
        <ul>
            <li><a href="/api-docs">Swagger UI</a></li>
        </ul>
    `);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/v1/items", require("./routes/items"));
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/suppliers", require("./routes/suppliers"));
app.use("/api/v1/stock", require("./routes/stock"));
app.use("/api/v1/reports", require("./routes/reports"));

// Start server
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);