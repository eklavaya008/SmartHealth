const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: {
      type: String, // "YYYY-MM-DD"
      required: [true, 'Appointment date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    startTime: {
      type: String, // "HH:mm"
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'startTime must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'endTime must be in HH:mm format'],
    },
    symptoms: { type: String, required: [true, 'Symptoms are required'], trim: true, maxlength: 500 },
    predictedDisease: { type: String, default: '' },
    predictedSpecialty: { type: String, default: '' },
    predictionConfidence: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
);

// A doctor can only have one non-cancelled appointment per date+startTime.
appointmentSchema.index(
  { doctorId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: ['pending', 'confirmed', 'completed']
      }
    }
  }
);  

module.exports = mongoose.model('Appointment', appointmentSchema);