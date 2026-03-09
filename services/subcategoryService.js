/* eslint-disable new-cap */
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Subcategory = require("../models/subcategoryModel");
const apiError = require("../utils/apiError");

// @desc    Get all subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubcategories = asyncHandler(async (req, res) => {
  page = req.query.page || 1;
  limit = req.query.limit || 5;
  skip = (page - 1) * limit;
  const subcategories = await Subcategory.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: subcategories.length, page, data: subcategories });
});

// @desc    Get a single subcategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new apiError(`No subcategory for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc    Create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private/Admin
exports.createSubcategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subcategory = await Subcategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subcategory });
});

// @desc    Update a subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private/Admin
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subcategory = await Subcategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    { new: true },
  );
  if (!subcategory) {
    return next(new apiError(`No subcategory for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc    Delete a subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findByIdAndDelete(id);
  if (!subcategory) {
    return next(new apiError(`No subcategory for this ID: ${id}`, 404));
  }
  res.status(204).send();
});
