const { ApiError } = require('./errorHandler');

const authorize = (...roles) => (req, res, next) => {
  if (!req.role || !roles.includes(req.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  next();
};

module.exports = authorize;
