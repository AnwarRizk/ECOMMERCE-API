const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  validatorMiddleware,
];

exports.createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long"),
  check("category")
    .notEmpty()
    .withMessage("Associated category is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  validatorMiddleware,
];
