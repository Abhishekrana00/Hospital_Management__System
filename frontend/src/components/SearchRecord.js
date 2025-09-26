import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchRecord.css';

const SearchRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('patientId');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockData = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State',
      lastVisit: '2024-01-15',
      diagnosis: 'Hypertension',
      status: 'Active'
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      phone: '+1-555-0124',
      email: 'jane.smith@email.com',
      address: '456 Oak Ave, City, State',
      lastVisit: '2024-01-10',
      diagnosis: 'Diabetes Type 2',
      status: 'Active'
    },
    {
      id: 'P003',
      name: 'Robert Johnson',
      age: 67,
      gender: 'Male',
      phone: '+1-555-0125',
      email: 'robert.j@email.com',
      address: '789 Pine Rd, City, State',
      lastVisit: '2024-01-08',
      diagnosis: 'Arthritis',
      status: 'Active'
    },
    {
      id: 'P004',
      name: 'Sarah Wilson',
      age: 28,
      gender: 'Female',
      phone: '+1-555-0126',
      email: 'sarah.w@email.com',
      address: '321 Elm St, City, State',
      lastVisit: '2024-01-12',
      diagnosis: 'Migraine',
      status: 'Active'
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [];
      
      if (searchType === 'patientId') {
        results = mockData.filter(patient => 
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchType === 'name') {
        results = mockData.filter(patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchType === 'phone') {
        results = mockData.filter(patient => 
          patient.phone.includes(searchTerm)
        );
      } else if (searchType === 'email') {
        results = mockData.filter(patient => 
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleViewDetails = (patientId) => {
    alert(`Viewing details for patient: ${patientId}`);
    // In a real application, this would navigate to a detailed patient view
  };

  return (
    <div className="search-record">
      <header className="search-header">
        <nav className="search-nav">
          <div className="nav-brand">
            <h1>🏥 MedCare Hospital</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </nav>
      </header>

      <div className="search-container">
        <div className="search-section">
          <h2>Search Patient Records</h2>
          <p>Find patient information using various search criteria</p>
          
          <div className="search-form">
            <div className="search-input-group">
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="patientId">Patient ID</option>
                <option value="name">Patient Name</option>
                <option value="phone">Phone Number</option>
                <option value="email">Email Address</option>
              </select>
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Enter ${searchType === 'patientId' ? 'Patient ID' : 
                           searchType === 'name' ? 'Patient Name' : 
                           searchType === 'phone' ? 'Phone Number' : 'Email Address'}`}
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              <button 
                onClick={handleSearch} 
                className="search-btn"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              
              <button 
                onClick={handleClearSearch} 
                className="clear-btn"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="results-section">
            <h3>Search Results ({searchResults.length} found)</h3>
            <div className="results-grid">
              {searchResults.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <h4>{patient.name}</h4>
                    <span className={`status-badge ${patient.status.toLowerCase()}`}>
                      {patient.status}
                    </span>
                  </div>
                  
                  <div className="patient-details">
                    <div className="detail-row">
                      <span className="label">Patient ID:</span>
                      <span className="value">{patient.id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Age:</span>
                      <span className="value">{patient.age} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gender:</span>
                      <span className="value">{patient.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{patient.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{patient.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Last Visit:</span>
                      <span className="value">{patient.lastVisit}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Diagnosis:</span>
                      <span className="value">{patient.diagnosis}</span>
                    </div>
                  </div>
                  
                  <div className="patient-actions">
                    <button 
                      onClick={() => handleViewDetails(patient.id)}
                      className="view-details-btn"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && searchTerm && !isSearching && (
          <div className="no-results">
            <p>No patients found matching your search criteria.</p>
            <p>Try adjusting your search terms or search type.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRecord;
