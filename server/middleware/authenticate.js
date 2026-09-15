const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { COOKIE_NAME } = require('../lib/token');
const { ApiError } = require('./errorHandler');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

const MODEL_BY_ROLE = { patient: Patient, doctor: Doctor, admin: Admin };

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) throw new ApiError(401, 'Not authenticated');

    const decoded = jwt.verify(token, JWT_SECRET);
    const Model = MODEL_BY_ROLE[decoded.role];
    if (!Model) throw new ApiError(401, 'Invalid session');

    const user = await Model.findById(decoded.id);
    if (!user) throw new ApiError(401, 'Account no longer exists');

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'Not authenticated'));
  }
};

module.exports = authenticate;
