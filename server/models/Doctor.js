const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: [
      'Cardiology',
      'Pulmonology',
      'Gastroenterology',
      'Neurology',
      'Dermatology',
      'General Medicine',
      'Rheumatology',
      'Orthopedics'
    ]
  },
  qualifications: {
    type: String,
    required: [true, 'Qualifications are required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);

