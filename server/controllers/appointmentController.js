const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const asyncHandler = require('../lib/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const { getAvailableSlots } = require('../lib/slots');
const { predictConditions, FALLBACK } = require('../lib/diseasePrediction');

const isPastDate = (dateStr) => dateStr < new Date().toISOString().slice(0, 10);

const getApprovedDoctorOrThrow = async (doctorId) => {
  const doctor = await Doctor.findOne({ _id: doctorId, status: 'approved' });
  if (!doctor) throw new ApiError(404, 'Doctor not found or not currently accepting bookings');
  return doctor;
};

const getBookedStartTimes = async (doctorId, date) => {
  const booked = await Appointment.find({ doctorId, date, status: { $ne: 'cancelled' } }).select('startTime');
  return booked.map((a) => a.startTime);
};

const getSlots = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;
  if (isPastDate(date)) return res.json({ slots: [] });

  const doctor = await getApprovedDoctorOrThrow(doctorId);
  const bookedStartTimes = await getBookedStartTimes(doctorId, date);
  const slots = getAvailableSlots(doctor.availability, date, bookedStartTimes);

  res.json({ slots });
});

const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, startTime, symptoms } = req.body;

  if (isPastDate(date)) throw new ApiError(400, 'Cannot book an appointment in the past');

  const doctor = await getApprovedDoctorOrThrow(doctorId);
  const bookedStartTimes = await getBookedStartTimes(doctorId, date);
  const availableSlots = getAvailableSlots(doctor.availability, date, bookedStartTimes);
  const slot = availableSlots.find((s) => s.startTime === startTime);

  if (!slot) {
    throw new ApiError(409, 'That slot is no longer available. Please choose another time.');
  }

  const { results, hasMatch } = predictConditions(symptoms);
  const prediction = hasMatch ? results[0] : FALLBACK;

  try {
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      symptoms,
      predictedDisease: prediction.disease,
      predictedSpecialty: prediction.specialty,
      predictionConfidence: prediction.confidence,
    });
    res.status(201).json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, 'That slot was just booked by someone else. Please choose another time.');
    }
    throw err;
  }
});

const getMyPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('doctorId', 'name specialty hospital')
    .sort({ date: -1, startTime: -1 });
  res.json(appointments);
});

const getMyDoctorAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { doctorId: req.user._id };
  if (status) query.status = status;

  const appointments = await Appointment.find(query)
    .populate('patientId', 'name phone dob gender')
    .sort({ date: -1, startTime: -1 });
  res.json(appointments);
});

const TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only manage your own appointments');
  }
  if (!TRANSITIONS[appointment.status].includes(status)) {
    throw new ApiError(400, `Cannot change status from ${appointment.status} to ${status}`);
  }

  appointment.status = status;
  if (notes !== undefined) appointment.notes = notes;
  await appointment.save();

  res.json(appointment);
});

const cancelMyAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.patientId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only cancel your own appointments');
  }
  if (!TRANSITIONS[appointment.status].includes('cancelled')) {
    throw new ApiError(400, `Cannot cancel an appointment that is already ${appointment.status}`);
  }

  appointment.status = 'cancelled';
  await appointment.save();
  res.json(appointment);
});

module.exports = {
  getSlots,
  bookAppointment,
  getMyPatientAppointments,
  getMyDoctorAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
};
