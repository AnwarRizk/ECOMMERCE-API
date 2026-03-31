const mongoose = require("mongoose");

// create model schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [50, "Category name must be less than 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const setImageURL = (doc) => {
  if (doc.image) {
    const baseURL = process.env.BASE_URL;
    doc.image = `${baseURL}/categories/${doc.image}`;
  }
};

// Work on create (save) Category
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

// Works on Update, Get One and Get All Categories
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

// create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
