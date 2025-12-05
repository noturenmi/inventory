const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Item", ItemSchema);