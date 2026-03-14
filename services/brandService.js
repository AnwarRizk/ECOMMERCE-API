/* eslint-disable new-cap */
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const apiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(Brand.find(), req.query, {
    searchFields: ["name"],
  })
    .filter()
    .sort()
    .limitFields()
    .search()
    .paginate(5);

  const brands = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ results: brands.length, page: apiFeatures.page, data: brands });
});

// @desc    Get a single brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new apiError(`No brand for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private/Admin
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc    Update a brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!brand) {
    return next(new apiError(`No brand for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Delete a brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new apiError(`No brand for this ID: ${id}`, 404));
  }
  res.status(204).send({});
});
