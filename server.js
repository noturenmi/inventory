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

// Default redirect
app.get("/", (req, res) => {
    res.redirect("/api/v1/items");
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