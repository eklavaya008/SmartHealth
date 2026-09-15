const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../validators/validate');
const { slotsQueryRules, bookAppointmentRules, statusUpdateRules } = require('../validators/appointmentValidators');

const router = express.Router();

router.get('/slots', slotsQueryRules, validate, appointmentController.getSlots);

router.post(
  '/',
  authenticate,
  authorize('patient'),
  bookAppointmentRules,
  validate,
  appointmentController.bookAppointment
);

router.get('/me', authenticate, authorize('patient'), appointmentController.getMyPatientAppointments);
router.patch('/:id/cancel', authenticate, authorize('patient'), appointmentController.cancelMyAppointment);

router.get('/doctor/me', authenticate, authorize('doctor'), appointmentController.getMyDoctorAppointments);
router.patch(
  '/:id/status',
  authenticate,
  authorize('doctor'),
  statusUpdateRules,
  validate,
  appointmentController.updateAppointmentStatus
);

module.exports = router;
