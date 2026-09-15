const { validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const message = errors
    .array()
    .map((e) => e.msg)
    .join(', ');
  next(new ApiError(400, message));
};

module.exports = validate;
