/* eslint-disable new-cap */
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const apiError = require("../utils/apiError");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  page = req.query.page || 1;
  limit = req.query.limit || 5;
  skip = (page - 1) * limit;
  const products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new apiError(`No product for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    return next(new apiError(`No product for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new apiError(`No product for this ID: ${id}`, 404));
  }
  res.status(204).send({});
});
