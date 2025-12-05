const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET /categories
router.get("/", async (req, res) => {
    res.json(await Category.find());
});

// POST /categories
router.post("/", async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
});

// DELETE /categories/:id
router.delete("/:id", async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
});

module.exports = router;