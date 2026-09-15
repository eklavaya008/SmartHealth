const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/doctors', adminController.listDoctors);
router.patch('/doctors/:id/status', adminController.updateDoctorStatus);

module.exports = router;
