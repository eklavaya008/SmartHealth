const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiters');
const validate = require('../validators/validate');
const { loginRules, patientSignupRules, doctorSignupRules } = require('../validators/authValidators');

const router = express.Router();

router.post('/patient/signup', authLimiter, patientSignupRules, validate, authController.patientSignup);
router.post('/patient/login', authLimiter, loginRules, validate, authController.patientLogin);

router.post('/doctor/signup', authLimiter, doctorSignupRules, validate, authController.doctorSignup);
router.post('/doctor/login', authLimiter, loginRules, validate, authController.doctorLogin);

router.post('/admin/login', authLimiter, loginRules, validate, authController.adminLogin);

router.get('/me', authenticate, authController.me);
router.post('/logout', authController.logout);

module.exports = router;
