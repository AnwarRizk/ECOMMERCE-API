const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand, {
  searchFields: ["name"],
  defaultLimit: 5,
});

// @desc    Get a single brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private/Admin
exports.createBrand = factory.createOne(Brand);

// @desc    Update a brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete a brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin
exports.deleteBrand = factory.deleteOne(Brand);
