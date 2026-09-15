const { body } = require('express-validator');

const predictRules = [
  body('symptoms')
    .trim()
    .notEmpty()
    .withMessage('Please describe your symptoms')
    .isLength({ max: 500 })
    .withMessage('Symptoms description must be under 500 characters'),
];

module.exports = { predictRules };
