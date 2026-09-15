const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { SPECIALTIES } = require('../constants/specialties');

const availabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
    slotMinutes: { type: Number, default: 30, min: 5, max: 240 },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Doctor name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    specialty: { type: String, required: [true, 'Specialty is required'], enum: SPECIALTIES },
    qualifications: { type: String, required: [true, 'Qualifications are required'] },
    experience: { type: Number, required: [true, 'Experience is required'], min: 0 },
    hospital: { type: String, required: [true, 'Hospital name is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    licenseNumber: { type: String, required: [true, 'Medical license number is required'], trim: true },
    bio: { type: String, default: '', maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'deactivated'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    availability: { type: [availabilitySchema], default: [] },
  },
  { timestamps: true }
);

doctorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

doctorSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
