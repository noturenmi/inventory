const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String,
    supplier: String,
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Item", ItemSchema);