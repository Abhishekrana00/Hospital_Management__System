const express = require('express');
const Appointment = require('../models/Appointment');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Book a new appointment (patient only)
// @access  Private (Patient only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        status: 'error',
        message: 'Only patients can book appointments'
      });
    }

    const {
      department,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes,
      isEmergency = false
    } = req.body;

    // Validate required fields
    if (!department || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields (department, doctorId, appointmentDate, appointmentTime)'
      });
    }

    // Verify doctor exists and is active
    const User = require('../models/User');
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || !doctor.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or unavailable doctor'
      });
    }

    // Validate date is not in the past
    const appointmentDateObj = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDateObj.setHours(0, 0, 0, 0);
    
    if (appointmentDateObj < today) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot book appointments in the past'
      });
    }

    // If booking for today, check if time is in the past
    if (appointmentDateObj.getTime() === today.getTime()) {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      if (appointmentDateTime < new Date()) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot book appointments in the past. Please select a future time.'
        });
      }
    }

    // Check if doctor already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate + 'T00:00:00'),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available at this time. Please select another time slot.'
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user._id,
      patientEmail: req.user.email,
      department,
      doctor: doctorId,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      appointmentDate: new Date(appointmentDate + 'T00:00:00'), // Ensure proper date parsing
      appointmentTime,
      notes: notes || '',
      isEmergency: isEmergency === true || isEmergency === 'true'
    });

    // Auto-confirm emergency appointments
    if (appointment.isEmergency) {
      appointment.status = 'confirmed';
      appointment.confirmedAt = new Date();
    }

    await appointment.save();
    
    console.log('Appointment created successfully:', appointment._id);

    // Populate patient info
    await appointment.populate('patient', 'firstName lastName email phone');

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: {
        appointment
      }
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to book appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('✅ GET /api/appointments - Request received');
    console.log('   User ID:', req.user._id);
    console.log('   User Role:', req.user.role);
    let appointments;

    // Patients can only see their own appointments
    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor', 'firstName lastName email phone')
        .sort({ appointmentDate: -1, appointmentTime: -1 });
    } else if (req.user.role === 'doctor') {
      // Doctors can see their own appointments
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor', 'firstName lastName email phone')
        .sort({ appointmentDate: -1, appointmentTime: -1 });
    } else {
      // Other staff can see all appointments
      appointments = await Appointment.find()
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor', 'firstName lastName email phone')
        .sort({ appointmentDate: -1, appointmentTime: -1 });
    }

    res.json({
      status: 'success',
      data: {
        appointments
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get appointments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments/doctors/available
// @desc    Get available doctors for booking
// @access  Private (Patient)
router.get('/doctors/available', authenticateToken, async (req, res) => {
  try {
    const { department, date, time } = req.query;
    const User = require('../models/User');

    // Get all active doctors
    let query = { 
      role: 'doctor', 
      isActive: true 
    };

    // If department is specified, filter doctors by department
    if (department) {
      query.department = department;
    }

    let doctors = await User.find(query).select('firstName lastName email phone department');

    // If date and time are specified, filter out doctors who already have appointments
    if (date && time) {
      const appointmentDate = new Date(date + 'T00:00:00');
      const existingAppointments = await Appointment.find({
        appointmentDate,
        appointmentTime: time,
        status: { $in: ['pending', 'confirmed'] }
      }).select('doctor');

      const busyDoctorIds = existingAppointments.map(apt => apt.doctor.toString());
      doctors = doctors.filter(doctor => !busyDoctorIds.includes(doctor._id.toString()));
    }

    res.json({
      status: 'success',
      data: {
        doctors: doctors.map(doctor => ({
          _id: doctor._id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          email: doctor.email,
          phone: doctor.phone,
          department: doctor.department
        }))
      }
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get available doctors',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments/available-times
// @desc    Get available time slots for a doctor on a specific date
// @access  Private (Patient)
router.get('/available-times', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor ID and date are required'
      });
    }

    // Verify doctor exists
    const User = require('../models/User');
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || !doctor.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or unavailable doctor'
      });
    }

    const appointmentDate = new Date(date + 'T00:00:00');
    
    // Get all booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate,
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime');

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableTimes = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this time slot is available
        if (!bookedTimes.includes(timeString)) {
          // Also check if it's not in the past (if booking for today)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(appointmentDate);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate.getTime() === today.getTime()) {
            const appointmentDateTime = new Date(`${date}T${timeString}`);
            if (appointmentDateTime > new Date()) {
              availableTimes.push(timeString);
            }
          } else {
            availableTimes.push(timeString);
          }
        }
      }
    }

    res.json({
      status: 'success',
      data: {
        availableTimes,
        bookedTimes
      }
    });
  } catch (error) {
    console.error('Get available times error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get available times',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments/doctors/count
// @desc    Get total count of registered doctors
// @access  Public (or Private for patients)
router.get('/doctors/count', async (req, res) => {
  try {
    const User = require('../models/User');
    const count = await User.countDocuments({ 
      role: 'doctor', 
      isActive: true 
    });

    res.json({
      status: 'success',
      data: {
        count
      }
    });
  } catch (error) {
    console.error('Get doctor count error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get doctor count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments/doctors/list
// @desc    Get list of all registered doctors with their departments
// @access  Public (or Private for patients)
router.get('/doctors/list', async (req, res) => {
  try {
    const User = require('../models/User');
    const doctors = await User.find({ 
      role: 'doctor', 
      isActive: true 
    }).select('firstName lastName email phone department').sort({ department: 1, firstName: 1 });

    res.json({
      status: 'success',
      data: {
        doctors: doctors.map(doctor => ({
          _id: doctor._id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          email: doctor.email,
          phone: doctor.phone,
          department: doctor.department
        }))
      }
    });
  } catch (error) {
    console.error('Get doctors list error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get doctors list',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName email phone');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Patients can only see their own appointments
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get appointment'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status (staff only) or cancel (patient)
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Patients can only cancel their own appointments
    if (req.user.role === 'patient') {
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      // Patients can only cancel
      if (req.body.status && req.body.status !== 'cancelled') {
        return res.status(403).json({
          status: 'error',
          message: 'Patients can only cancel appointments'
        });
      }

      appointment.status = 'cancelled';
      appointment.cancelledBy = 'patient';
      if (req.body.cancellationReason) {
        appointment.cancellationReason = req.body.cancellationReason;
      }
    } else if (req.user.role === 'doctor') {
      // Doctors can approve or cancel their own appointments
      if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'You can only manage your own appointments'
        });
      }

      // Doctors can confirm or cancel
      if (req.body.status) {
        if (req.body.status === 'confirmed') {
          appointment.status = 'confirmed';
          appointment.confirmedAt = new Date();
        } else if (req.body.status === 'cancelled') {
          appointment.status = 'cancelled';
          appointment.cancelledBy = 'doctor';
          // Require cancellation reason from doctor
          if (!req.body.cancellationReason || req.body.cancellationReason.trim() === '') {
            return res.status(400).json({
              status: 'error',
              message: 'Cancellation reason is required when cancelling an appointment'
            });
          }
          appointment.cancellationReason = req.body.cancellationReason.trim();
        } else {
          return res.status(403).json({
            status: 'error',
            message: 'Doctors can only confirm or cancel appointments'
          });
        }
      }
    } else {
      // Other staff can update status
      if (req.body.status) {
        appointment.status = req.body.status;
      }
    }

    await appointment.save();
    await appointment.populate('patient', 'firstName lastName email phone');

    res.json({
      status: 'success',
      message: 'Appointment updated successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update appointment'
    });
  }
});

module.exports = router;

