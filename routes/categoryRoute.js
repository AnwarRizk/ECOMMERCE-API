const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/categories" });

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../services/categoryService");

const router = express.Router();

const subcategoryRoute = require("./subcategoryRoute");

// Nested route for subcategories under a specific category
router.use("/:categoryId/subcategories", subcategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(uploadCategoryImage, createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
