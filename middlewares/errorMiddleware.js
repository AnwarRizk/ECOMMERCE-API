const apiError = require('../utils/apiError');

handleJwtInvalidSignature = () =>
  new apiError('Invalid token. Please log in again', 401);

handleJwtExpired = () =>
  new apiError('Token expired. Please log in again', 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJwtExpired();
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
