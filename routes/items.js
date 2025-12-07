const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET all items (with optional population)
router.get("/", async (req, res) => {
    try {
        const items = await Item.find()
            .populate("category", "name description")
            .populate("supplier", "name contactPerson phone");
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
        
        const item = await Item.findById(req.params.id)
            .populate("category")
            .populate("supplier");
            
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
        // Validate category and supplier IDs
        const { category, supplier, ...itemData } = req.body;
        
        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ 
                message: "Invalid category ID format",
                field: "category" 
            });
        }
        
        // Validate supplier ID
        if (!mongoose.Types.ObjectId.isValid(supplier)) {
            return res.status(400).json({ 
                message: "Invalid supplier ID format",
                field: "supplier" 
            });
        }
        
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ 
                message: "Category not found",
                field: "category" 
            });
        }
        
        // Check if supplier exists
        const supplierExists = await Supplier.findById(supplier);
        if (!supplierExists) {
            return res.status(404).json({ 
                message: "Supplier not found",
                field: "supplier" 
            });
        }
        
        // Create new item
        const newItem = new Item({
            ...itemData,
            category,
            supplier
        });
        
        const savedItem = await newItem.save();
        
        // Populate references before sending response
        const populatedItem = await Item.findById(savedItem._id)
            .populate("category")
            .populate("supplier");
            
        res.status(201).json(populatedItem);
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
        
        const { category, supplier, ...updateData } = req.body;
        
        // Validate category ID if provided
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ 
                message: "Invalid category ID format",
                field: "category" 
            });
        }
        
        // Validate supplier ID if provided
        if (supplier && !mongoose.Types.ObjectId.isValid(supplier)) {
            return res.status(400).json({ 
                message: "Invalid supplier ID format",
                field: "supplier" 
            });
        }
        
        // Check if category exists if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ 
                    message: "Category not found",
                    field: "category" 
                });
            }
        }
        
        // Check if supplier exists if provided
        if (supplier) {
            const supplierExists = await Supplier.findById(supplier);
            if (!supplierExists) {
                return res.status(404).json({ 
                    message: "Supplier not found",
                    field: "supplier" 
                });
            }
        }
        
        // Prepare update object
        const updateObj = { ...updateData };
        if (category) updateObj.category = category;
        if (supplier) updateObj.supplier = supplier;
        
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateObj,
            { new: true, runValidators: true }
        ).populate("category").populate("supplier");
        
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
        
        const deletedItem = await Item.findByIdAndDelete(req.params.id)
            .populate("category")
            .populate("supplier");
            
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