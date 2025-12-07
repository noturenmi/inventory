const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  reorderLevel: {
    type: Number,
    min: 0,
    default: 10
  },
  location: {
    type: String,
    trim: true,
    default: ""
  },
  status: {
    type: String,
    enum: ["active", "discontinued", "out-of-stock", "low-stock"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
itemSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Item", itemSchema);