import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './ViewAppointments.css';

const ViewAppointments = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      const response = await appointmentsAPI.getAppointments();
      console.log('Appointments response:', response);
      if (response && response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
        if (response.data.appointments.length === 0) {
          setMessage('No appointments found.');
        }
      } else {
        setMessage('No appointments data received.');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      const errorMsg = error.message || 'Failed to load appointments. Please try again.';
      setMessage(errorMsg);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentsAPI.updateAppointment(appointmentId, { status: 'cancelled' });
      setMessage('Appointment cancelled successfully');
      loadAppointments(); // Reload appointments
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setMessage(error.message || 'Failed to cancel appointment');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="view-appointments-page">
        <section className="va-hero">
          <h1>
            {user?.role === 'patient' 
              ? 'My Appointments' 
              : user?.role === 'doctor'
              ? 'My Appointments'
              : 'All Appointments'}
          </h1>
          <p>
            {user?.role === 'patient' 
              ? 'View and manage your appointments' 
              : user?.role === 'doctor'
              ? 'View and manage appointments assigned to you'
              : 'View all appointments'}
          </p>
        </section>

        <section className="va-card">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="appointments-header">
            <button onClick={loadAppointments} className="btn-refresh">
              🔄 Refresh
            </button>
            {user?.role === 'patient' && (
              <button 
                onClick={() => navigate('/appointments/book')} 
                className="btn-primary"
              >
                + Book New Appointment
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 && (!message || (!message.toLowerCase().includes('error') && !message.toLowerCase().includes('failed'))) ? (
            <div className="no-appointments">
              <p>{message || 'No appointments found.'}</p>
              {user?.role === 'patient' && (
                <button 
                  onClick={() => navigate('/appointments/book')} 
                  className="btn-primary"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          ) : appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-id">
                      <strong>ID:</strong> {appointment._id.slice(-8).toUpperCase()}
                      {appointment.isEmergency && (
                        <span style={{
                          marginLeft: '10px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: 'rgba(239,68,68,.2)',
                          border: '1px solid rgba(239,68,68,.3)',
                          color: '#ef4444'
                        }}>
                          🚨 EMERGENCY
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      {appointment.status === 'pending' && user?.role === 'doctor' && (() => {
                        const appointmentDateTime = new Date(`${new Date(appointment.appointmentDate).toISOString().split('T')[0]}T${appointment.appointmentTime}`);
                        const hoursUntil = (appointmentDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                        if (hoursUntil <= 6 && hoursUntil > 0) {
                          return (
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: '#fbbf24',
                              fontWeight: '600'
                            }}>
                              ⚠️ Confirm within {Math.floor(hoursUntil)}h {Math.floor((hoursUntil % 1) * 60)}m
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-row">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{appointment.department.charAt(0).toUpperCase() + appointment.department.slice(1)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Doctor:</span>
                      <span className="detail-value">
                        {appointment.doctorName || (appointment.doctor && typeof appointment.doctor === 'object' 
                          ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` 
                          : appointment.doctor)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{formatTime(appointment.appointmentTime)}</span>
                    </div>
                    {(user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'nurse' || user?.role === 'receptionist') && appointment.patient && (
                      <div className="detail-row">
                        <span className="detail-label">Patient:</span>
                        <span className="detail-value">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                          {appointment.patient.email && ` (${appointment.patient.email})`}
                        </span>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="detail-row">
                        <span className="detail-label">Notes:</span>
                        <span className="detail-value">{appointment.notes}</span>
                      </div>
                    )}
                    {appointment.status === 'cancelled' && appointment.cancellationReason && (
                      <div className="detail-row">
                        <span className="detail-label">Cancellation Reason:</span>
                        <span className="detail-value" style={{ 
                          color: appointment.cancelledBy === 'system' ? '#fbbf24' : '#ef4444',
                          fontStyle: 'italic'
                        }}>
                          {appointment.cancellationReason}
                          {appointment.cancelledBy === 'system' && (
                            <span style={{ 
                              display: 'block', 
                              fontSize: '0.85rem', 
                              marginTop: '5px',
                              color: '#8ea1b2'
                            }}>
                              (Auto-cancelled: Doctor did not confirm within 6 hours)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {appointment.status === 'cancelled' && appointment.cancelledBy && (
                      <div className="detail-row">
                        <span className="detail-label">Cancelled By:</span>
                        <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                          {appointment.cancelledBy === 'system' ? 'System (Auto)' : appointment.cancelledBy}
                          {appointment.autoCancelledAt && (
                            <span style={{ 
                              display: 'block', 
                              fontSize: '0.85rem', 
                              marginTop: '5px',
                              color: '#8ea1b2'
                            }}>
                              on {formatDate(appointment.autoCancelledAt)} {formatTime(new Date(appointment.autoCancelledAt).toTimeString().split(' ')[0])}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {user?.role === 'patient' && appointment.status === 'pending' && (
                    <div className="appointment-actions">
                      <button 
                        onClick={() => handleCancel(appointment._id)}
                        className="btn-cancel"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}

                  {user?.role === 'doctor' && appointment.status === 'pending' && (
                    <div className="appointment-actions">
                      <button 
                        onClick={async () => {
                          try {
                            await appointmentsAPI.updateAppointment(appointment._id, { 
                              status: 'confirmed' 
                            });
                            setMessage('Appointment confirmed successfully');
                            loadAppointments();
                          } catch (error) {
                            setMessage(error.message || 'Failed to confirm appointment');
                          }
                        }}
                        className="btn-confirm"
                        style={{ 
                          background: 'rgba(34,197,94,.2)', 
                          border: '1px solid rgba(34,197,94,.3)', 
                          color: '#22c55e',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          marginRight: '10px'
                        }}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setCancellationReason('');
                          setShowCancelModal(true);
                        }}
                        className="btn-cancel"
                      >
                        ✗ Cancel
                      </button>
                    </div>
                  )}

                  {user?.role === 'doctor' && appointment.status !== 'pending' && (
                    <div className="appointment-actions">
                      <span className="status-badge" style={{ 
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}>
                        Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {(user?.role === 'admin' || user?.role === 'nurse' || user?.role === 'receptionist') && (
                    <div className="appointment-actions">
                      <select
                        value={appointment.status}
                        onChange={async (e) => {
                          try {
                            await appointmentsAPI.updateAppointment(appointment._id, { 
                              status: e.target.value 
                            });
                            loadAppointments();
                          } catch (error) {
                            setMessage(error.message || 'Failed to update appointment');
                          }
                        }}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {/* Cancel Modal for Doctors */}
          {showCancelModal && selectedAppointment && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="modal-content" style={{
                background: 'rgba(2,6,23,.95)',
                border: '1px solid rgba(148,163,184,.3)',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                color: '#e6eef5'
              }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Cancel Appointment</h2>
                <p style={{ color: '#8ea1b2', marginBottom: '20px' }}>
                  Please provide a reason for cancelling this appointment. This reason will be visible to the patient.
                </p>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter cancellation reason (required)..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(2,6,23,.5)',
                    border: '1px solid rgba(148,163,184,.18)',
                    color: '#e6eef5',
                    fontSize: '0.95rem',
                    marginBottom: '20px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedAppointment(null);
                      setCancellationReason('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!cancellationReason || cancellationReason.trim() === '') {
                        setMessage('Cancellation reason is required');
                        return;
                      }
                      try {
                        await appointmentsAPI.updateAppointment(selectedAppointment._id, {
                          status: 'cancelled',
                          cancellationReason: cancellationReason.trim()
                        });
                        setMessage('Appointment cancelled successfully');
                        setShowCancelModal(false);
                        setSelectedAppointment(null);
                        setCancellationReason('');
                        loadAppointments();
                      } catch (error) {
                        setMessage(error.message || 'Failed to cancel appointment');
                      }
                    }}
                    className="btn-cancel"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="appointments-footer">
            <button onClick={() => navigate('/')} className="btn-secondary">
              ← Back to Home
            </button>
            {user?.role === 'patient' && (
              <button onClick={() => navigate('/profile')} className="btn-secondary">
                View Profile
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Cancel Modal for Doctors */}
      {showCancelModal && selectedAppointment && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#1e293b',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(148,163,184,.2)'
          }}>
            <h2 style={{ color: '#e6eef5', marginBottom: '20px' }}>Cancel Appointment</h2>
            <p style={{ color: '#8ea1b2', marginBottom: '20px' }}>
              Please provide a reason for cancelling this appointment:
            </p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter cancellation reason (required)"
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(2,6,23,.5)',
                border: '1px solid rgba(148,163,184,.18)',
                color: '#e6eef5',
                fontSize: '0.95rem',
                marginBottom: '20px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancellationReason('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!cancellationReason.trim()) {
                    setMessage('Please provide a cancellation reason');
                    return;
                  }
                  try {
                    await appointmentsAPI.updateAppointment(selectedAppointment._id, {
                      status: 'cancelled',
                      cancellationReason: cancellationReason.trim()
                    });
                    setMessage('Appointment cancelled successfully');
                    setShowCancelModal(false);
                    setSelectedAppointment(null);
                    setCancellationReason('');
                    loadAppointments();
                  } catch (error) {
                    setMessage(error.message || 'Failed to cancel appointment');
                  }
                }}
                className="btn-cancel"
                style={{ minWidth: '120px' }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;

