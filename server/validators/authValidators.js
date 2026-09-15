const { body } = require('express-validator');
const { SPECIALTIES } = require('../constants/specialties');

const PASSWORD_RULE = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Za-z]/)
  .withMessage('Password must contain at least one letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

const EMAIL_RULE = body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail();

const loginRules = [EMAIL_RULE, body('password').notEmpty().withMessage('Password is required')];

const patientSignupRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  EMAIL_RULE,
  PASSWORD_RULE,
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('dob').isISO8601().toDate().withMessage('A valid date of birth is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
];

const doctorSignupRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  EMAIL_RULE,
  PASSWORD_RULE,
  body('specialty').isIn(SPECIALTIES).withMessage('Please select a valid specialty'),
  body('qualifications').trim().notEmpty().withMessage('Qualifications are required'),
  body('experience').isFloat({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('hospital').trim().notEmpty().withMessage('Hospital name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('licenseNumber').trim().notEmpty().withMessage('Medical license number is required'),
  body('bio').optional({ checkFalsy: true }).isLength({ max: 1000 }).withMessage('Bio must be under 1000 characters'),
];

module.exports = { loginRules, patientSignupRules, doctorSignupRules };
