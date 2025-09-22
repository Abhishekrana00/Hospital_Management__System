import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

const Contact = () => {
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
    if (!formData.fullName.trim()) next.fullName = 'Full name is required';
    if (!formData.email) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Enter a valid email';
    if (formData.phone && !/^\+?[\d\s\-\(\)]{7,}$/.test(formData.phone)) next.phone = 'Enter a valid phone';
    if (!formData.subject.trim()) next.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) next.message = 'Message must be at least 10 characters';
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
    <div className="contact-page">
      <section className="contact-hero">
        <h1>Contact MedCare</h1>
        <p>Questions, feedback, or support — we’re here to help 24/7.</p>
      </section>

      <section className="contact-grid">
        <div className="contact-info card">
          <div className="info-item">
            <div className="info-icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>123 Medical Center Dr, City, State 12345</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📧</div>
            <div>
              <h4>Email</h4>
              <p>support@medcare.com</p>
            </div>
          </div>
          <div className="info-divider" />
          <div className="info-meta">
            <span className="badge">24/7 Support</span>
            <span className="badge">Avg response under 2h</span>
          </div>
          <div className="info-actions">
            <Link to="/" className="btn-secondary">← Back to Home</Link>
            <Link to="/about" className="btn-primary">Learn About Us</Link>
          </div>
        </div>

        <div className="contact-form card">
          <h3>Send us a message</h3>
          {submitted && (
            <div className="alert-success">Thanks! We received your message and will reply shortly.</div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={errors.fullName ? 'error' : ''} placeholder="Jane Doe" />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="jane@example.com" />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} placeholder="+1 555 123 4567" />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} className={errors.subject ? 'error' : ''} placeholder="How can we help?" />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} className={errors.message ? 'error' : ''} placeholder="Write your message here..." />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;


