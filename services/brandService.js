/* eslint-disable new-cap */
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

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
