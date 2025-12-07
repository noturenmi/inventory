const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
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

categorySchema.pre("save", async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Category", categorySchema);