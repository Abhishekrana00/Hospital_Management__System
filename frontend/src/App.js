import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import PatientRegister from './components/PatientRegister';
import AppointmentBook from './components/AppointmentBook';
import SearchRecord from './components/SearchRecord';
import ViewReport from './components/ViewReport';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/patients/register" element={<PatientRegister />} />
          <Route path="/appointments/book" element={<AppointmentBook />} />
          <Route path="/search" element={<SearchRecord />} />
          <Route path="/reports" element={<ViewReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
