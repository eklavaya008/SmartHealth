const express = require('express');
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../validators/validate');
const { updateProfileRules, availabilityRules } = require('../validators/doctorValidators');

const router = express.Router();

router.get('/', doctorController.listDoctors);

router.patch(
  '/me/profile',
  authenticate,
  authorize('doctor'),
  updateProfileRules,
  validate,
  doctorController.updateMyProfile
);
router.patch(
  '/me/availability',
  authenticate,
  authorize('doctor'),
  availabilityRules,
  validate,
  doctorController.updateMyAvailability
);

router.get('/:id', doctorController.getDoctorById);

module.exports = router;
