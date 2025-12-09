const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/Category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category
router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Category name already exists" 
      });
    }
    res.status(500).json({ message: err.message });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Category name already exists" 
      });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ 
      message: "Category deleted successfully",
      deletedCategory: category 
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;