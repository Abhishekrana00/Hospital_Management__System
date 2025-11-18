import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './DoctorsList.css';

const DoctorsList = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDoctors();
  }, [isAuthenticated, navigate]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      const response = await appointmentsAPI.getDoctorsList();
      if (response.data && response.data.doctors) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setMessage(error.message || 'Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = ['general', 'cardiology', 'pediatrics', 'orthopedics', 'neurology', 'dermatology'];
  
  const filteredDoctors = filterDepartment 
    ? doctors.filter(doctor => doctor.department === filterDepartment)
    : doctors;

  const doctorsByDepartment = departments.reduce((acc, dept) => {
    acc[dept] = doctors.filter(doctor => doctor.department === dept);
    return acc;
  }, {});

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="doctors-list-page">
        <section className="dl-hero">
          <h1>Registered Doctors</h1>
          <p>View all registered doctors and their departments</p>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#8ea1b2' }}>
            Total Doctors: <strong>{doctors.length}</strong>
          </p>
        </section>

        <section className="dl-card">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="doctors-header">
            <button onClick={loadDoctors} className="btn-refresh">
              🔄 Refresh
            </button>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="loading">Loading doctors...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="no-doctors">
              <p>No doctors found{filterDepartment ? ` in ${filterDepartment} department` : ''}.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-avatar">
                    <span className="avatar-icon">
                      {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <div className="doctor-details">
                      <div className="detail-item">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                          {doctor.department || 'N/A'}
                        </span>
                      </div>
                      {doctor.email && (
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{doctor.email}</span>
                        </div>
                      )}
                      {doctor.phone && (
                        <div className="detail-item">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">{doctor.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grouped by Department View */}
          {!filterDepartment && doctors.length > 0 && (
            <div className="doctors-by-department">
              <h2>Doctors by Department</h2>
              {departments.map(dept => {
                const deptDoctors = doctorsByDepartment[dept];
                if (!deptDoctors || deptDoctors.length === 0) return null;
                
                return (
                  <div key={dept} className="department-section">
                    <h3>{dept.charAt(0).toUpperCase() + dept.slice(1)} ({deptDoctors.length})</h3>
                    <div className="doctors-grid">
                      {deptDoctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                          <div className="doctor-avatar">
                            <span className="avatar-icon">
                              {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="doctor-info">
                            <h3>{doctor.name}</h3>
                            {doctor.email && <p className="doctor-email">{doctor.email}</p>}
                            {doctor.phone && <p className="doctor-phone">{doctor.phone}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="doctors-footer">
            <button onClick={() => navigate('/')} className="btn-secondary">
              ← Back to Home
            </button>
            {user?.role === 'patient' && (
              <>
                <button onClick={() => navigate('/appointments/book')} className="btn-primary">
                  Book Appointment
                </button>
                <button onClick={() => navigate('/profile')} className="btn-secondary">
                  View Profile
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorsList;

