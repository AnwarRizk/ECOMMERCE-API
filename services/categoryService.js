const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");

// 1) Disk storage configuration for multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });

exports.uploadCategoryImage = upload.single("image");

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
