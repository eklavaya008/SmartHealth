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

const PROFILE_FIELDS = ['name', 'specialty', 'qualifications', 'experience', 'hospital', 'phone', 'bio'];

const updateMyProfile = asyncHandler(async (req, res) => {
  PROFILE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json(req.user);
});

const updateMyAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  for (const rule of availability) {
    if (rule.startTime >= rule.endTime) {
      throw new ApiError(400, `startTime must be before endTime for dayOfWeek ${rule.dayOfWeek}`);
    }
  }

  req.user.availability = availability;
  await req.user.save();
  res.json(req.user);
});

module.exports = { listDoctors, getDoctorById, updateMyProfile, updateMyAvailability };
