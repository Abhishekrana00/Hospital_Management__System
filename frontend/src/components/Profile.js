import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, removeToken, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUser, logout: authLogout } = useAuth();
  const [user, setUser] = useState(authUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        role: authUser.role || ''
      });
      setIsLoading(false);
      
      // Load doctor count if user is a patient
      if (authUser.role === 'patient') {
        loadDoctorCount();
      }
    } else {
      loadProfile();
    }
  }, [authUser]);

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

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getCurrentUser();
        if (response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || ''
        });
        
        // Load doctor count if user is a patient
        if (userData.role === 'patient') {
          loadDoctorCount();
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.message.includes('token') || error.message.includes('401')) {
        // Token expired or invalid, redirect to login
        removeToken();
        navigate('/login');
      } else {
        setMessage('Failed to load profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        updateUser(updatedUser); // Update auth context
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Reload profile to get latest data
        setTimeout(() => {
          loadProfile();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    removeToken();
    authLogout();
    navigate('/');
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      });
    }
    setIsEditing(false);
    setErrors({});
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="error-message">Failed to load profile</div>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
                {user.lastName?.[0]?.toUpperCase() || ''}
              </span>
            </div>
            <h1>My Profile</h1>
            <p>{user.email}</p>
          </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-info">
              <div className="info-row">
                <label>First Name</label>
                <div className="info-value">{user.firstName || 'Not set'}</div>
              </div>
              <div className="info-row">
                <label>Last Name</label>
                <div className="info-value">{user.lastName || 'Not set'}</div>
              </div>
              <div className="info-row">
                <label>Email</label>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-row">
                <label>Phone</label>
                <div className="info-value">{user.phone || 'Not set'}</div>
              </div>
              <div className="info-row">
                <label>Role</label>
                <div className="info-value role-badge">{user.role || 'patient'}</div>
              </div>
              {user.role === 'doctor' && user.department && (
                <div className="info-row">
                  <label>Department</label>
                  <div className="info-value role-badge" style={{ textTransform: 'capitalize' }}>
                    {user.department}
                  </div>
                </div>
              )}
              <div className="info-row">
                <label>Account Status</label>
                <div className={`info-value status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Doctor Count Section for Patients */}
            {user?.role === 'patient' && (
              <div className="doctor-count-section" style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(102,126,234,.1)',
                border: '1px solid rgba(102,126,234,.2)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  color: '#e6eef5', 
                  marginBottom: '10px',
                  fontSize: '1.3rem'
                }}>
                  Available Doctors
                </h3>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#667eea',
                  marginBottom: '10px'
                }}>
                  {doctorCount}
                </div>
                <p style={{ 
                  color: '#8ea1b2', 
                  marginBottom: '15px',
                  fontSize: '0.95rem'
                }}>
                  {doctorCount === 0 
                    ? 'No doctors registered yet' 
                    : doctorCount === 1
                    ? 'Doctor is registered and available for appointments'
                    : 'Doctors are registered and available for appointments'}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link 
                    to="/doctors" 
                    className="btn-primary" 
                    style={{ 
                      textDecoration: 'none', 
                      display: 'inline-block',
                      padding: '10px 20px',
                      fontSize: '0.9rem'
                    }}
                  >
                    View All Doctors
                  </Link>
                  <Link 
                    to="/appointments/book" 
                    className="btn-primary" 
                    style={{ 
                      textDecoration: 'none', 
                      display: 'inline-block',
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      background: 'rgba(34,197,94,.2)',
                      border: '1px solid rgba(34,197,94,.3)',
                      color: '#22c55e'
                    }}
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Profile
              </button>
              {user?.role === 'patient' && (
                <Link to="/appointments" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  View My Appointments
                </Link>
              )}
              {(user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse' || user?.role === 'receptionist') && (
                <Link to="/appointments" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  View All Appointments
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled"
                placeholder="Email (cannot be changed)"
              />
              <small className="field-note">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                disabled
                className="disabled"
                placeholder="Role (cannot be changed)"
              />
              <small className="field-note">Role cannot be changed</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="profile-footer">
          <button onClick={() => navigate('/')} className="link-button">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;

