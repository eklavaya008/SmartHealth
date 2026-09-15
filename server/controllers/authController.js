const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const asyncHandler = require('../lib/asyncHandler');
const { signToken, setAuthCookie, clearAuthCookie } = require('../lib/token');
const { ApiError } = require('../middleware/errorHandler');

const MODEL_BY_ROLE = { patient: Patient, doctor: Doctor, admin: Admin };

const issueSession = (res, user, role) => {
  const token = signToken({ id: user._id, role });
  setAuthCookie(res, token);
};

const patientSignup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, dob, gender } = req.body;

  const existing = await Patient.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const patient = await Patient.create({ name, email, password, phone, dob, gender });
  issueSession(res, patient, 'patient');
  res.status(201).json({ role: 'patient', user: patient });
});

const patientLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email }).select('+password');
  if (!patient || !(await patient.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  issueSession(res, patient, 'patient');
  res.json({ role: 'patient', user: patient });
});

const doctorSignup = asyncHandler(async (req, res) => {
  const { name, email, password, specialty, qualifications, experience, hospital, phone, licenseNumber, bio } =
    req.body;

  const existing = await Doctor.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const doctor = await Doctor.create({
    name,
    email,
    password,
    specialty,
    qualifications,
    experience,
    hospital,
    phone,
    licenseNumber,
    bio,
  });
  issueSession(res, doctor, 'doctor');
  res.status(201).json({ role: 'doctor', user: doctor });
});

const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const doctor = await Doctor.findOne({ email }).select('+password');
  if (!doctor || !(await doctor.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  issueSession(res, doctor, 'doctor');
  res.json({ role: 'doctor', user: doctor });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  issueSession(res, admin, 'admin');
  res.json({ role: 'admin', user: admin });
});

const me = asyncHandler(async (req, res) => {
  res.json({ role: req.role, user: req.user });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

module.exports = {
  patientSignup,
  patientLogin,
  doctorSignup,
  doctorLogin,
  adminLogin,
  me,
  logout,
};
