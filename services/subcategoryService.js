/* eslint-disable new-cap */
const Subcategory = require("../models/subcategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc    Get all subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubcategories = factory.getAll(Subcategory, {
  searchFields: ["name"],
  defaultLimit: 5,
});

// @desc    Get a single subcategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubcategory = factory.getOne(Subcategory);

// @desc    Create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private/Admin
exports.createSubcategory = factory.createOne(Subcategory);

// @desc    Update a subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private/Admin
exports.updateSubcategory = factory.updateOne(Subcategory);

// @desc    Delete a subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin
exports.deleteSubcategory = factory.deleteOne(Subcategory);
