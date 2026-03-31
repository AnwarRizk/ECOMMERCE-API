const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product title is required"],
      //   unique: [true, "product title must be unique"],
      minlength: [3, "product title must be at least 3 characters"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "product slug is required"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [20, "product description must be at least 20 characters"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      //   max: [10, "product price must be less than 10 characters"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "product must belong to a category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map(
      (img) => `${process.env.BASE_URL}/products/${img}`,
    );
  }
};

// Works on Create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Works on Update, Find One and Find All
productSchema.post("init", (docs) => {
  setImageURL(docs);
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
