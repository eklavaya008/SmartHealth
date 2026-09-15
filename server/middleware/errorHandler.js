const { NODE_ENV } = require('../config/env');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Something went wrong. Please try again later.' : err.message,
    ...(NODE_ENV === 'development' && statusCode === 500 ? { error: err.message, stack: err.stack } : {}),
  });
};

module.exports = { ApiError, notFoundHandler, errorHandler };
