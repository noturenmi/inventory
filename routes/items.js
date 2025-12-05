const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET all items
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// POST create item
router.post("/", async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
});

// GET item by ID
router.get("/:id", async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});

// PUT update item
router.put("/:id", async (req, res) => {
    const item = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(item);
});

// DELETE item
router.delete("/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
});

module.exports = router;