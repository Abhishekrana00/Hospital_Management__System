import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import PatientRegister from './components/PatientRegister';
import AppointmentBook from './components/AppointmentBook';
import SearchRecord from './components/SearchRecord';
import ViewReport from './components/ViewReport';
import BackendTest from './components/BackendTest';
import Profile from './components/Profile';
import ViewAppointments from './components/ViewAppointments';
import DoctorsList from './components/DoctorsList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<ViewAppointments />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/patients/register" element={<PatientRegister />} />
            <Route path="/appointments/book" element={<AppointmentBook />} />
            <Route path="/search" element={<SearchRecord />} />
            <Route path="/reports" element={<ViewReport />} />
            <Route path="/test-backend" element={<BackendTest />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
