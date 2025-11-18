import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <h1>🏥 MedCare Hospital</h1>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#services">Services</a>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'patient' && (
                <>
                  <Link to="/appointments">My Appointments</Link>
                  <Link to="/doctors">Doctors</Link>
                </>
              )}
              {(user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse' || user?.role === 'receptionist') && (
                <Link to="/appointments">Appointments</Link>
              )}
              <div className="user-menu">
                <Link to="/profile" className="user-link">
                  <span className="user-avatar">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    {user?.lastName?.[0]?.toUpperCase() || ''}
                  </span>
                  <span className="user-name">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="register-btn">Sign Up</Link>
              <Link to="/login" className="login-btn">Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

