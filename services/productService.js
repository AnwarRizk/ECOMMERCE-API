/* eslint-disable new-cap */
const Product = require("../models/productModel");
const factory = require("./handlersFactory");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, {
  populate: { path: "category", select: "name -_id" },
  defaultLimit: 50,
});

// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, {
  path: "category",
  select: "name -_id",
});

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
