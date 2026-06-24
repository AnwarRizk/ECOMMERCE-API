const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// @desc    Signup new user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Create token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ data: user, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1- Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  // 2- Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  // 3- Create token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Make sure the user is authenticated (logged in) before accessing protected routes
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  // 2- Check if token exists
  if (!token) {
    return next(
      new ApiError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 3- Verify token (not expired & not manipulated)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  // 4- Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }

  // 5- Check if user changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (decoded.iat < passwordChangedTimestamp) {
      return next(
        new ApiError(
          'User recently changed password! Please log in again',
          401,
        ),
      );
    }
  }

  // 6- Grant access to protected route
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403),
      );
    }
    next();
  });
