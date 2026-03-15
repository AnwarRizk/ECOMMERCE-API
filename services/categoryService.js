/* eslint-disable new-cap */
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category, {
  searchFields: ["name"],
  defaultLimit: 5,
});

// @desc    Get a single category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = factory.createOne(Category);

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
