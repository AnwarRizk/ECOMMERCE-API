const express = require('express');
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObject,
} = require('../services/subcategoryService');
const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require('../utils/validators/subcategoryValidator');

const authService = require('../services/authService');

const router = express.Router({ mergeParams: true }); // Merge params to access categoryId in nested routes

router
  .route('/')
  .get(createFilterObject, getSubcategories)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubcategoryValidator,
    createSubcategory,
  );
router
  .route('/:id')
  .get(getSubcategoryValidator, getSubcategory)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateSubcategoryValidator,
    updateSubcategory,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteSubcategoryValidator,
    deleteSubcategory,
  );

module.exports = router;
