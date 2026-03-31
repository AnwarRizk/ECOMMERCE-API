const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "Brand name must be at least 3 characters"],
      maxlength: [32, "Brand name must be less than 32 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

const setImageURL = (doc) => {
  if (doc.image) {
    const baseURL = process.env.BASE_URL;
    doc.image = `${baseURL}/brands/${doc.image}`;
  }
};

// Work on create (save) Brand
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Works on Update, Get One and Get All Brands
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
