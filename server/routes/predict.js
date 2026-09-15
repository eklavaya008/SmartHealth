const express = require('express');
const predictionController = require('../controllers/predictionController');
const validate = require('../validators/validate');
const { predictRules } = require('../validators/predictionValidators');

const router = express.Router();

router.post('/', predictRules, validate, predictionController.predict);

module.exports = router;
