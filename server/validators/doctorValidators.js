const { body } = require('express-validator');
const { SPECIALTIES } = require('../constants/specialties');

const TIME_RULE = (field) =>
  body(field)
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage(`${field} must be in HH:mm 24-hour format`);

const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('specialty').optional().isIn(SPECIALTIES).withMessage('Please select a valid specialty'),
  body('qualifications').optional().trim().notEmpty().withMessage('Qualifications cannot be empty'),
  body('experience').optional().isFloat({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('hospital').optional().trim().notEmpty().withMessage('Hospital name cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('bio').optional({ checkFalsy: true }).isLength({ max: 1000 }).withMessage('Bio must be under 1000 characters'),
];

const availabilityRules = [
  body('availability').isArray().withMessage('Availability must be an array'),
  body('availability.*.dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('dayOfWeek must be between 0 and 6'),
  TIME_RULE('availability.*.startTime'),
  TIME_RULE('availability.*.endTime'),
  body('availability.*.slotMinutes')
    .optional()
    .isInt({ min: 5, max: 240 })
    .withMessage('slotMinutes must be between 5 and 240'),
];

module.exports = { updateProfileRules, availabilityRules };
