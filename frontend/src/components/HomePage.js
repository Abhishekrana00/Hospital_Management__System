import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🏥 MedCare Hospital</h1>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Advanced Hospital Management System</h2>
          <p>Streamline your healthcare operations with our comprehensive management solution</p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hospital-illustration">
            <div className="building">🏥</div>
            <div className="medical-symbols">
              <span>⚕️</span>
              <span>💊</span>
              <span>🩺</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="services">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Patient Management</h3>
              <p>Comprehensive patient records, appointments, and medical history tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Staff Management</h3>
              <p>Manage doctors, nurses, and administrative staff with role-based access</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Appointment Scheduling</h3>
              <p>Efficient scheduling system with automated reminders and conflict detection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Pharmacy Management</h3>
              <p>Track medications, inventory, and prescriptions with real-time updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Billing & Insurance</h3>
              <p>Automated billing, insurance claims processing, and payment tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Reports</h3>
              <p>Comprehensive reporting and analytics for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-access">
        <div className="container">
          <h2>Quick Access</h2>
          <div className="access-grid">
            <div className="access-card">
              <div className="access-icon">📋</div>
              <h3>Patient Registration</h3>
              <p>Register new patients quickly</p>
              <Link to="/patients/register" className="access-btn">Register Patient</Link>
            </div>
            <div className="access-card">
              <div className="access-icon">📅</div>
              <h3>Book Appointment</h3>
              <p>Schedule patient appointments</p>
              <Link to="/appointments/book" className="access-btn">Book Now</Link>
            </div>
            <div className="access-card">
              <div className="access-icon">🔍</div>
              <h3>Search Records</h3>
              <p>Find patient information</p>
              <button className="access-btn">Search</button>
            </div>
            <div className="access-card">
              <div className="access-icon">📈</div>
              <h3>View Reports</h3>
              <p>Access system reports</p>
              <button className="access-btn">View Reports</button>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,250+</div>
              <div className="stat-label">Active Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85+</div>
              <div className="stat-label">Medical Staff</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Daily Appointments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>MedCare Hospital</h3>
              <p>Providing advanced healthcare management solutions for modern hospitals.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#support">Technical Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📧 info@medcare.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Medical Center Dr, City, State 12345</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MedCare Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
