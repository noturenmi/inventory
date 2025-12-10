const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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

// GET a supplier by ID
router.get("/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a supplier by ID
router.put("/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a supplier by ID
router.delete("/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.json({ message: "Supplier deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;