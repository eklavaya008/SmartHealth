const express = require('express');
const Doctor = require('../models/Doctor');
const router = express.Router();

// GET /api/doctors?specialty=<specialty>
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    
    let query = {};
    if (specialty) {
      query.specialty = specialty;
    }

    const doctors = await Doctor.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

module.exports = router;

