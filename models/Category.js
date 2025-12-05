const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// GET all categories
router.get("/", async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// POST create category
router.post("/", async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
});

// PUT update category
router.put("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE category
router.delete("/:id", async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
});

module.exports = mongoose.model("Category", CategorySchema);