const { body, query, param } = require('express-validator');

const DATE_RULE = (source) =>
  source
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('date must be in YYYY-MM-DD format');

const slotsQueryRules = [
  query('doctorId').isMongoId().withMessage('A valid doctorId is required'),
  DATE_RULE(query('date')),
];

const bookAppointmentRules = [
  body('doctorId').isMongoId().withMessage('A valid doctorId is required'),
  DATE_RULE(body('date')),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('startTime must be in HH:mm format'),
  body('symptoms')
    .trim()
    .notEmpty()
    .withMessage('Please describe your symptoms')
    .isLength({ max: 500 })
    .withMessage('Symptoms description must be under 500 characters'),
];

const statusUpdateRules = [
  param('id').isMongoId().withMessage('Invalid appointment id'),
  body('status').isIn(['confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional({ checkFalsy: true }).isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters'),
];

module.exports = { slotsQueryRules, bookAppointmentRules, statusUpdateRules };
