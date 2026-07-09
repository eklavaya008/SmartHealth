const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/appointments
router.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      symptoms,
      preferredDateTime,
      predictedDisease,
      predictedSpecialty,
      doctorId
    } = req.body;

    // Validation
    if (!name || !age || !gender || !symptoms || !preferredDateTime || !doctorId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Convert doctorId to ObjectId if it's a string
    const doctorObjectId = mongoose.Types.ObjectId.isValid(doctorId) 
      ? new mongoose.Types.ObjectId(doctorId) 
      : doctorId;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorObjectId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      name,
      age,
      gender,
      symptoms,
      preferredDateTime: new Date(preferredDateTime),
      predictedDisease,
      predictedSpecialty,
      doctorId: doctorObjectId,
      status: 'pending'
    });

    await appointment.save();
    
    // Populate doctor info
    await appointment.populate('doctorId', 'name specialty hospital');

    // Only log essential info (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Appointment created for:', appointment.name, '- Doctor:', appointment.doctorId?.name || 'N/A');
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// GET /api/appointments?doctorId=<id>
router.get('/', auth, async (req, res) => {
  try {
    const { doctorId } = req.query;
    const query = {};

    // Always use the authenticated doctor's ID
    const authenticatedDoctorId = req.doctor._id;
    
    // If doctorId is provided in query, verify it matches the authenticated doctor
    if (doctorId) {
      const queryDoctorId = mongoose.Types.ObjectId.isValid(doctorId) 
        ? new mongoose.Types.ObjectId(doctorId) 
        : doctorId;
      
      // Only allow doctors to see their own appointments
      if (queryDoctorId.toString() !== authenticatedDoctorId.toString()) {
        return res.status(403).json({ message: 'Not authorized to view these appointments' });
      }
      query.doctorId = queryDoctorId;
    } else {
      // Show appointments for the authenticated doctor
      query.doctorId = authenticatedDoctorId;
    }

    // Find all appointments for this doctor
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty hospital')
      .sort({ preferredDateTime: -1 });

    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`Found ${appointments.length} appointment(s) for Dr. ${req.doctor.name}`);
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// PATCH /api/appointments/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if appointment belongs to the authenticated doctor
    if (appointment.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (status) {
      appointment.status = status;
    }
    
    if (notes !== undefined) {
      appointment.notes = notes;
    }

    await appointment.save();
    await appointment.populate('doctorId', 'name specialty hospital');

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

module.exports = router;

