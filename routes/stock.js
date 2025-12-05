const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET /stock/:itemId
router.get("/:itemId", async (req, res) => {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ id: item.id, stock: item.stock });
});

// PATCH /stock/:itemId
router.patch("/:itemId", async (req, res) => {
    const item = await Item.findByIdAndUpdate(
        req.params.itemId,
        { stock: req.body.stock },
        { new: true }
    );
    res.json(item);
});

module.exports = router;