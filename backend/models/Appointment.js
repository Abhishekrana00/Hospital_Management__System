const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  patientEmail: {
    type: String,
    required: [true, 'Patient email is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['general', 'cardiology', 'pediatrics', 'orthopedics', 'neurology', 'dermatology']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'system'],
    default: null
  },
  autoCancelledAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  },
  isEmergency: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Virtual to check if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  const appointmentDateTime = new Date(`${this.appointmentDate.toISOString().split('T')[0]}T${this.appointmentTime}`);
  return appointmentDateTime < new Date();
});

module.exports = mongoose.model('Appointment', appointmentSchema);

