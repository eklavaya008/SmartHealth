const Doctor = require('../models/Doctor');
const asyncHandler = require('../lib/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

const DOCTOR_STATUSES = ['pending', 'approved', 'rejected', 'deactivated'];

const listDoctors = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) {
    if (!DOCTOR_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status filter');
    query.status = status;
  }
  const doctors = await Doctor.find(query).sort({ createdAt: -1 });
  res.json(doctors);
});

const updateDoctorStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  if (!DOCTOR_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status');
  if (status === 'rejected' && !rejectionReason?.trim()) {
    throw new ApiError(400, 'A rejection reason is required when rejecting a doctor');
  }

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  doctor.status = status;
  doctor.rejectionReason = status === 'rejected' ? rejectionReason.trim() : '';
  await doctor.save();

  res.json(doctor);
});

module.exports = { listDoctors, updateDoctorStatus, DOCTOR_STATUSES };
