const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET /items
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// GET /items/:id
router.get("/:id", async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});

// POST /items
router.post("/", async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
});

// PUT /items/:id
router.put("/:id", async (req, res) => {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE /items/:id
router.delete("/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
});

module.exports = router;