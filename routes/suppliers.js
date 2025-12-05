const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// GET /suppliers
router.get("/", async (req, res) => {
    res.json(await Supplier.find());
});

// POST /suppliers
router.post("/", async (req, res) => {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
});

module.exports = router;