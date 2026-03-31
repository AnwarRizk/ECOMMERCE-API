const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const apiError = require("../utils/apiError");

// 1) Disk storage configuration for multer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
//   },
// });

// 2) Memory storage configuration for multer
const multerStorage = multer.memoryStorage();

// 3) File filter to allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new apiError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;

  next();
});

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
