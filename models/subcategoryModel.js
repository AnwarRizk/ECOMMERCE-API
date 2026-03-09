const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Subcategory name must be at least 2 characters"],
      maxlength: [32, "Subcategory name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Associated category is required"],
    },
  },
  { timestamps: true },
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
