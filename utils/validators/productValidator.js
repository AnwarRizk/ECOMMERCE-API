const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subcategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long")
    .isLength({ max: 2000 })
    .withMessage("Product description must be at most 2000 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Product price is too long"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be an array of strings"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for ID: ${categoryId}`);
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be an array")
    .isMongoId()
    .withMessage("Invalid subcategory ID format")
    .custom(async (subcategoryIds, { req }) => {
      const subcategories = await SubCategory.find({
        _id: { $exists: true, $in: subcategoryIds },
      });
      if (subcategories.length !== subcategoryIds.length) {
        throw new Error("One or more subcategories not found");
      }
      // Ensure all subcategories belong to the same category
      const CategoryId = req.body.category;
      const CategoryIds = subcategories.map((sub) => sub.category.toString());
      if (!CategoryIds.every((id) => id === CategoryId)) {
        throw new Error("All subcategories must belong to the same category");
      }
      return true;
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Product title must be at most 32 characters long"),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be an array of strings"),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be an array"),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format"),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
