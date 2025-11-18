import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './AppointmentBook.css';

const AppointmentBook = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    department: 'general',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    isEmergency: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!isAuthenticated) {
      setMessage('Please login as a patient to book appointments');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (user && user.role !== 'patient') {
      setMessage('Only patients can book appointments');
    } else if (user && user.role === 'patient') {
      // Load doctor count
      loadDoctorCount();
      // Load available doctors
      loadAvailableDoctors();
    }
  }, [isAuthenticated, user, navigate]);

  const loadDoctorCount = async () => {
    try {
      const response = await appointmentsAPI.getDoctorCount();
      if (response.data && response.data.count !== undefined) {
        setDoctorCount(response.data.count);
      }
    } catch (error) {
      console.error('Error loading doctor count:', error);
    }
  };

  const loadAvailableDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await appointmentsAPI.getAvailableDoctors(
        formData.department,
        formData.appointmentDate,
        formData.appointmentTime
      );
      if (response.data && response.data.doctors) {
        setAvailableDoctors(response.data.doctors);
        // Reset doctor selection if current doctor is not available
        if (formData.doctorId && !response.data.doctors.find(d => d._id === formData.doctorId)) {
          setFormData(prev => ({ ...prev, doctorId: '' }));
        }
      }
    } catch (error) {
      console.error('Error loading available doctors:', error);
      setMessage('Failed to load available doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && user.role === 'patient') {
      loadAvailableDoctors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.department, formData.appointmentDate, formData.appointmentTime]);

  // Load available times when doctor and date are selected
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      loadAvailableTimes();
    } else {
      setAvailableTimes([]);
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctorId, formData.appointmentDate]);

  const loadAvailableTimes = async () => {
    if (!formData.doctorId || !formData.appointmentDate) {
      setAvailableTimes([]);
      return;
    }

    try {
      setLoadingTimes(true);
      const response = await appointmentsAPI.getAvailableTimes(
        formData.doctorId,
        formData.appointmentDate
      );
      if (response && response.data && response.data.availableTimes) {
        setAvailableTimes(response.data.availableTimes);
        // Reset time selection if current time is not available
        if (formData.appointmentTime && !response.data.availableTimes.includes(formData.appointmentTime)) {
          setFormData(prev => ({ ...prev, appointmentTime: '' }));
        }
      } else {
        console.warn('No available times data in response:', response);
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error loading available times:', error);
      setAvailableTimes([]);
      // Don't show error message to user, just log it
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    
    if (name === 'department') {
      updatedFormData.doctorId = '';
      updatedFormData.appointmentTime = '';
    }
    
    if (name === 'doctorId' || name === 'appointmentDate') {
      updatedFormData.appointmentTime = '';
    }
    
    setFormData(updatedFormData);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate time if date is today and time is being changed
    if (name === 'appointmentTime' && updatedFormData.appointmentDate) {
      const selectedDate = new Date(updatedFormData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate.getTime() === today.getTime() && value) {
        const appointmentDateTime = new Date(`${updatedFormData.appointmentDate}T${value}`);
        if (appointmentDateTime < new Date()) {
          setErrors(prev => ({ ...prev, appointmentTime: 'Cannot book appointments in the past. Please select a future time.' }));
        }
      }
    }
    
    setMessage('');
  };

  const validate = () => {
    const next = {};
    if (!formData.department) next.department = 'Select a department';
    if (!formData.doctorId) next.doctorId = 'Select a doctor';
    if (!formData.appointmentDate) {
      next.appointmentDate = 'Select a date';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        next.appointmentDate = 'Cannot book appointments in the past';
      } else if (selectedDate.getTime() === today.getTime() && formData.appointmentTime) {
        // If booking for today, check if time is in the past
        const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
        if (appointmentDateTime < new Date()) {
          next.appointmentTime = 'Cannot book appointments in the past. Please select a future time.';
        }
      }
    }
    if (!formData.appointmentTime) {
      next.appointmentTime = 'Select a time';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Check authentication and role
    if (!isAuthenticated || !user) {
      setMessage('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (user.role !== 'patient') {
      setMessage('Only patients can book appointments');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      console.log('Booking appointment with data:', {
        department: formData.department,
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes
      });

      const response = await appointmentsAPI.bookAppointment({
        department: formData.department,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes || '',
        isEmergency: formData.isEmergency || false
      });

      console.log('Appointment booked successfully:', response);
      const successMessage = formData.isEmergency 
        ? 'Emergency appointment booked and automatically confirmed! Redirecting to profile...'
        : 'Appointment booked successfully! Redirecting to profile...';
      setMessage(successMessage);
      
      // Reset form
      setFormData({
        department: 'general',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        isEmergency: false
      });
      setAvailableTimes([]);

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Book appointment error:', error);
      const errorMessage = error.message || 'Failed to book appointment. Please try again.';
      setMessage(errorMessage);
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Show message if not authenticated or not a patient
  if (!isAuthenticated || (user && user.role !== 'patient')) {
    return (
      <div>
        <Navbar />
        <div className="appointment-page">
          <section className="ap-card">
            <div className="message error">
              {!isAuthenticated 
                ? 'Please login as a patient to book appointments' 
                : 'Only patients can book appointments'}
            </div>
            <div className="form-footer-links">
              {!isAuthenticated ? (
                <Link to="/login" className="btn-primary">Go to Login</Link>
              ) : (
                <Link to="/" className="btn-secondary">Back to Home</Link>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="appointment-page">
        <section className="ap-hero">
          <h1>Book Appointment</h1>
          <p>Choose department, doctor, and time to schedule a visit.</p>
          {user && (
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#8ea1b2' }}>
              Booking as: {user.firstName} {user.lastName} ({user.email})
            </p>
          )}
          {doctorCount > 0 && (
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#8ea1b2' }}>
              <p>
                Total Registered Doctors: <strong>{doctorCount}</strong>
              </p>
              <Link 
                to="/doctors" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'underline',
                  marginTop: '5px',
                  display: 'inline-block'
                }}
              >
                View All Registered Doctors →
              </Link>
            </div>
          )}
        </section>

        <section className="ap-card">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select 
                  id="department" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  className={errors.department ? 'error' : ''}
                >
                  <option value="general">General</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="neurology">Neurology</option>
                  <option value="dermatology">Dermatology</option>
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="doctorId">Doctor *</label>
                <select 
                  id="doctorId" 
                  name="doctorId" 
                  value={formData.doctorId} 
                  onChange={handleChange} 
                  className={errors.doctorId ? 'error' : ''}
                  disabled={loadingDoctors}
                >
                  <option value="" disabled>
                    {loadingDoctors ? 'Loading doctors...' : availableDoctors.length === 0 ? 'No doctors available' : 'Select doctor'}
                  </option>
                  {availableDoctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} {doctor.department ? `(${doctor.department.charAt(0).toUpperCase() + doctor.department.slice(1)})` : ''}
                    </option>
                  ))}
                </select>
                {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
                {formData.appointmentDate && formData.appointmentTime && availableDoctors.length === 0 && !loadingDoctors && (
                  <span className="error-message" style={{ color: '#fbbf24' }}>
                    No doctors available at this time. Please select another date/time.
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="appointmentDate">Date *</label>
                <input 
                  id="appointmentDate" 
                  name="appointmentDate" 
                  type="date" 
                  value={formData.appointmentDate} 
                  onChange={handleChange} 
                  className={errors.appointmentDate ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="appointmentTime">Time *</label>
                {formData.doctorId && formData.appointmentDate ? (
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className={errors.appointmentTime ? 'error' : ''}
                    disabled={loadingTimes || availableTimes.length === 0}
                  >
                    <option value="" disabled>
                      {loadingTimes 
                        ? 'Loading available times...' 
                        : availableTimes.length === 0 
                        ? 'No available times' 
                        : 'Select time'}
                    </option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>
                        {(() => {
                          const [hours, minutes] = time.split(':');
                          const hour = parseInt(hours);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const displayHour = hour % 12 || 12;
                          return `${displayHour}:${minutes} ${ampm}`;
                        })()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input 
                    id="appointmentTime" 
                    name="appointmentTime" 
                    type="text" 
                    value="" 
                    disabled
                    placeholder="Select doctor and date first"
                    className={errors.appointmentTime ? 'error' : ''}
                  />
                )}
                {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
                {formData.doctorId && formData.appointmentDate && availableTimes.length === 0 && !loadingTimes && (
                  <span className="error-message" style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
                    No available time slots for this doctor on this date. Please select another date.
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isEmergency"
                  checked={formData.isEmergency}
                  onChange={(e) => setFormData(prev => ({ ...prev, isEmergency: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>
                  <strong style={{ color: '#ef4444' }}>Emergency Appointment</strong>
                  <span style={{ fontSize: '0.85rem', color: '#8ea1b2', display: 'block', marginTop: '4px' }}>
                    Emergency appointments are automatically confirmed
                  </span>
                </span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea 
                id="notes" 
                name="notes" 
                rows="4" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Symptoms, preferences, etc." 
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary submit-btn" 
              disabled={isSubmitting || !user || user.role !== 'patient'}
            >
              {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
            </button>
            {(!user || user.role !== 'patient') && (
              <p style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>
                You must be logged in as a patient to book appointments
              </p>
            )}
          </form>
          <div className="form-footer-links">
            <Link to="/patients/register" className="btn-secondary">Register Patient</Link>
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppointmentBook;
