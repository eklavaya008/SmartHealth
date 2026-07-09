const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token || 
                  req.query?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const doctor = await Doctor.findById(decoded.id).select('-password');

    if (!doctor) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;

