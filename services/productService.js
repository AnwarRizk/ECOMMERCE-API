const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  console.log(req.files);
  // 1) Process cover image
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    // Add image name to req.body.imageCover
    req.body.imageCover = imageCoverFilename;
  }

  // 2) Process images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Add image name to req.body.images array
        req.body.images.push(imageName);
      }),
    );
  }
  next();
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product);

// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product);

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = factory.createOne(Product);

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = factory.deleteOne(Product);
