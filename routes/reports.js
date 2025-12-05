const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET /reports/inventory
router.get("/inventory", async (req, res) => {
    const items = await Item.find();
    const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

    res.json({
        generatedAt: new Date(),
        totalItems: items.length,
        totalStock,
        items
    });
});

module.exports = router;