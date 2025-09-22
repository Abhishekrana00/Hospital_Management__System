import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientRegister.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'female',
  address: '',
  city: '',
  state: '',
  zip: '',
  insuranceProvider: '',
  policyNumber: ''
};

const PatientRegister = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.firstName.trim()) next.firstName = 'First name is required';
    if (!formData.lastName.trim()) next.lastName = 'Last name is required';
    if (!formData.email) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Enter a valid email';
    if (!formData.phone) next.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) next.phone = 'Enter a valid phone';
    if (!formData.dateOfBirth) next.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) next.address = 'Address is required';
    if (!formData.city.trim()) next.city = 'City is required';
    if (!formData.state.trim()) next.state = 'State is required';
    if (!formData.zip.trim()) next.zip = 'ZIP/Postal code is required';
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

  return (
    <div className="patient-register-page">
      <section className="pr-hero">
        <h1>Register New Patient</h1>
        <p>Create a patient profile to enable appointments and care tracking.</p>
      </section>

      <section className="pr-card">
        {submitted && (
          <div className="alert-success">Patient registered successfully! (Demo)</div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'error' : ''} placeholder="Jane" />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'error' : ''} placeholder="Doe" />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="jane@example.com" />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} placeholder="+1 555 123 4567" />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'error' : ''} />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className={errors.address ? 'error' : ''} placeholder="123 Street" />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input id="state" name="state" type="text" value={formData.state} onChange={handleChange} className={errors.state ? 'error' : ''} />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP</label>
              <input id="zip" name="zip" type="text" value={formData.zip} onChange={handleChange} className={errors.zip ? 'error' : ''} />
              {errors.zip && <span className="error-message">{errors.zip}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="insuranceProvider">Insurance Provider (optional)</label>
              <input id="insuranceProvider" name="insuranceProvider" type="text" value={formData.insuranceProvider} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="policyNumber">Policy # (optional)</label>
              <input id="policyNumber" name="policyNumber" type="text" value={formData.policyNumber} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Register Patient'}
          </button>
        </form>
        <div className="form-footer-links">
          <Link to="/appointments/book" className="btn-secondary">Book Appointment</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </section>
    </div>
  );
};

export default PatientRegister;


