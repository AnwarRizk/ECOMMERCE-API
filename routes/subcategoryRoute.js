const express = require("express");
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subcategoryService");
const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subcategoryValidator");

const router = express.Router({ mergeParams: true }); // Merge params to access categoryId in nested routes

router
  .route("/")
  .get(createFilterObject, getSubcategories)
  .post(setCategoryIdToBody, createSubcategoryValidator, createSubcategory);
router
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategory)
  .put(updateSubcategoryValidator, updateSubcategory)
  .delete(deleteSubcategoryValidator, deleteSubcategory);

module.exports = router;
