const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
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
app.use("/api/v1/items", require("./routes/items"));

// Categories
app.use("/api/v1/categories", require("./routes/categories"));

// Suppliers
app.use("/api/v1/suppliers", require("./routes/suppliers"));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Swagger JSON at /swagger
app.get("/swagger", (req, res) => {
  res.sendFile(path.join(__dirname, "swagger", "swagger.json"));
});

// Serve Swagger UI and static files
app.use("/swagger", express.static(path.join(__dirname, "swagger")));

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = app;