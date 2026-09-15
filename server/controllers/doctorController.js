const Doctor = require('../models/Doctor');
const asyncHandler = require('../lib/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

const listDoctors = asyncHandler(async (req, res) => {
  const { specialty } = req.query;
  const query = { status: 'approved' };
  if (specialty) query.specialty = specialty;

  const doctors = await Doctor.find(query).sort({ name: 1 });
  res.json(doctors);
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ _id: req.params.id, status: 'approved' });
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  res.json(doctor);
});

module.exports = { listDoctors, getDoctorById };
