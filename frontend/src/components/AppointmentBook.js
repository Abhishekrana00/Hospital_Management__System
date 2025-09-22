import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AppointmentBook.css';

const initialForm = {
  patientEmail: '',
  department: 'general',
  doctor: '',
  date: '',
  time: '',
  notes: ''
};

const doctorsByDept = {
  general: ['Dr. Smith', 'Dr. Patel'],
  cardiology: ['Dr. Chen', 'Dr. Johnson'],
  pediatrics: ['Dr. Lee', 'Dr. Brown']
};

const AppointmentBook = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'department') {
      setFormData(prev => ({ ...prev, department: value, doctor: '' }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.patientEmail) next.patientEmail = 'Patient email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) next.patientEmail = 'Enter a valid email';
    if (!formData.department) next.department = 'Select a department';
    if (!formData.doctor) next.doctor = 'Select a doctor';
    if (!formData.date) next.date = 'Select a date';
    if (!formData.time) next.time = 'Select a time';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      setSubmitted(true);
      setFormData(initialForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const doctorOptions = doctorsByDept[formData.department] || [];

  return (
    <div className="appointment-page">
      <section className="ap-hero">
        <h1>Book Appointment</h1>
        <p>Choose department, doctor, and time to schedule a visit.</p>
      </section>

      <section className="ap-card">
        {submitted && (
          <div className="alert-success">Appointment booked! Check your email for details. (Demo)</div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="patientEmail">Patient Email</label>
              <input id="patientEmail" name="patientEmail" type="email" value={formData.patientEmail} onChange={handleChange} className={errors.patientEmail ? 'error' : ''} placeholder="patient@example.com" />
              {errors.patientEmail && <span className="error-message">{errors.patientEmail}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} className={errors.department ? 'error' : ''}>
                <option value="general">General</option>
                <option value="cardiology">Cardiology</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doctor">Doctor</label>
              <select id="doctor" name="doctor" value={formData.doctor} onChange={handleChange} className={errors.doctor ? 'error' : ''}>
                <option value="" disabled>Select doctor</option>
                {doctorOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.doctor && <span className="error-message">{errors.doctor}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className={errors.date ? 'error' : ''} />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input id="time" name="time" type="time" value={formData.time} onChange={handleChange} className={errors.time ? 'error' : ''} />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} placeholder="Symptoms, preferences, etc." />
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Booking…' : 'Book Appointment'}
          </button>
        </form>
        <div className="form-footer-links">
          <Link to="/patients/register" className="btn-secondary">Register Patient</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </section>
    </div>
  );
};

export default AppointmentBook;


