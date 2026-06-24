const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID format'),
  validatorMiddleware,
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters long')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number format'),
  check('profileImg').optional(),
  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user ID format'),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('User name must be at most 32 characters long')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number format'),
  check('profileImg').optional(),
  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  validatorMiddleware,
];

// - verify that the current password is correct before allowing the user to change their password
// - verify confirmation password matches the new password
exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user ID format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      // Compare the provided current password with the stored hashed password
      const isMatch = await bcrypt.compare(value, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user ID format'),
  validatorMiddleware,
];
