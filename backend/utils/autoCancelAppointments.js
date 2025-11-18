const Appointment = require('../models/Appointment');

/**
 * Auto-cancel appointments that are within 6 hours and still pending
 * This function should be called periodically (e.g., every 15 minutes)
 */
const autoCancelPendingAppointments = async () => {
  try {
    const now = new Date();

    // Find all pending appointments
    const pendingAppointments = await Appointment.find({
      status: 'pending'
    });

    let cancelledCount = 0;

    for (const appointment of pendingAppointments) {
      // Calculate the exact appointment datetime
      const appointmentDateStr = appointment.appointmentDate.toISOString().split('T')[0];
      const [hours, minutes] = appointment.appointmentTime.split(':');
      const appointmentDateTime = new Date(appointment.appointmentDate);
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Check if appointment is within 6 hours
      const timeDifference = appointmentDateTime.getTime() - now.getTime();
      const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);

      // If appointment is within 6 hours (0 to 6 hours) and still pending, auto-cancel
      // Only cancel if appointment is in the future (not past)
      if (hoursUntilAppointment <= 6 && hoursUntilAppointment >= 0) {
        appointment.status = 'cancelled';
        appointment.cancelledBy = 'system';
        appointment.cancellationReason = 'Automatically cancelled: Doctor did not confirm appointment within 6 hours before scheduled time.';
        appointment.autoCancelledAt = new Date();
        
        await appointment.save();
        cancelledCount++;
        
        console.log(`⚠️  Auto-cancelled appointment ${appointment._id} - Doctor: ${appointment.doctorName}, Patient: ${appointment.patientEmail}, Time: ${appointmentDateTime.toISOString()}`);
      }
    }

    if (cancelledCount > 0) {
      console.log(`✅ Auto-cancelled ${cancelledCount} appointment(s) that were not confirmed within 6 hours`);
    }

    return cancelledCount;
  } catch (error) {
    console.error('❌ Error in auto-cancel appointments:', error);
    return 0;
  }
};

/**
 * Check appointments every 15 minutes
 */
const startAutoCancelScheduler = () => {
  // Run immediately after a short delay (to allow DB connection)
  setTimeout(async () => {
    try {
      await autoCancelPendingAppointments();
    } catch (error) {
      console.error('Initial auto-cancel check error:', error);
    }
  }, 10000); // Wait 10 seconds for DB connection
  
  // Then run every 15 minutes
  setInterval(async () => {
    try {
      await autoCancelPendingAppointments();
    } catch (error) {
      console.error('Scheduled auto-cancel check error:', error);
    }
  }, 15 * 60 * 1000); // 15 minutes in milliseconds

  console.log('⏰ Auto-cancel scheduler started - checking every 15 minutes for unconfirmed appointments within 6 hours');
};

module.exports = {
  autoCancelPendingAppointments,
  startAutoCancelScheduler
};
