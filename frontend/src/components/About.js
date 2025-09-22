import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">Hospital Management System</div>
          <h1>Built for modern healthcare operations</h1>
          <p>
            MedCare unifies patients, staff, pharmacy, billing, and analytics into a single, intuitive platform
            that scales with your hospital.
          </p>
          <div className="about-cta">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="about-hero-visual">
          <div className="card mockup">
            <div className="mockup-header">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <div className="mockup-body">
              <div className="mockup-stats">
                <div className="mockup-stat">
                  <div className="label">Active Patients</div>
                  <div className="value">1,250+</div>
                </div>
                <div className="mockup-stat">
                  <div className="label">Daily Appointments</div>
                  <div className="value">500+</div>
                </div>
              </div>
              <div className="mockup-chart" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">System Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-value"><span className="accent"><span role="img" aria-label="shield">🛡️</span></span> HIPAA</div>
            <div className="stat-label">Security Focus</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">10x</div>
            <div className="stat-label">Faster Workflows</div>
          </div>
        </div>
      </section>

      <section className="about-features">
        <h2>Everything you need, all in one place</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Patient Hub</h3>
            <p>Unified records, visits, history, and documents with rich search.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Scheduling</h3>
            <p>Smart appointment booking with conflict detection and reminders.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Pharmacy</h3>
            <p>Inventory, prescriptions, and expiry tracking in real time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Billing</h3>
            <p>Insurance claims, invoices, and payments made effortless.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Staff</h3>
            <p>Roles, permissions, and shift planning for every department.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Operational insights and KPIs for data‑driven decisions.</p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <h2>Our principles</h2>
        <div className="values-grid">
          <div className="value-card">
            <h4>Privacy First</h4>
            <p>End‑to‑end best practices to protect patient data at every step.</p>
          </div>
          <div className="value-card">
            <h4>Reliability</h4>
            <p>Cloud‑ready architecture for consistent performance and uptime.</p>
          </div>
          <div className="value-card">
            <h4>Usability</h4>
            <p>Interfaces designed with clinicians for zero‑friction workflows.</p>
          </div>
        </div>
      </section>

      <section className="about-cta-banner">
        <div className="cta-content">
          <h3>Ready to modernize your hospital?</h3>
          <p>Start a free demo and see how MedCare fits your team.</p>
        </div>
        <div className="cta-actions">
          <Link to="/register" className="btn-primary">Create Account</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </section>
    </div>
  );
};

export default About;


