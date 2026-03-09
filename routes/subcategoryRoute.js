const express = require("express");
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../services/subcategoryService");
const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subcategoryValidator");

const router = express.Router();

router
  .route("/")
  .get(getSubcategories)
  .post(createSubcategoryValidator, createSubcategory);
router
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategory)
  .put(updateSubcategoryValidator, updateSubcategory)
  .delete(deleteSubcategoryValidator, deleteSubcategory);

module.exports = router;