const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Item = require("../models/Item");

// GET all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single item by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }
        
        const item = await Item.findById(req.params.id);
            
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new item
router.post("/", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        
        const savedItem = await newItem.save();
            
        res.status(201).json(savedItem);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: messages 
            });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT update item
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }
        
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json(updatedItem);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: messages 
            });
        }
        res.status(500).json({ message: error.message });
    }
});

// DELETE item
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }
        
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
            
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json({ 
            message: "Item deleted successfully", 
            deletedItem 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;