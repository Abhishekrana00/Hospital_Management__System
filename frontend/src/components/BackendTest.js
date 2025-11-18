import React, { useState, useEffect } from 'react';
import { healthCheck, authAPI } from '../services/api';
import './Auth.css';

const BackendTest = () => {
  const [status, setStatus] = useState('Checking...');
  const [healthStatus, setHealthStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await healthCheck();
      setHealthStatus({
        success: true,
        message: response.message,
        timestamp: response.timestamp
      });
      setStatus('✅ Backend is running!');
    } catch (error) {
      setHealthStatus({
        success: false,
        message: error.message || 'Cannot connect to backend'
      });
      setStatus('❌ Backend connection failed');
    }
  };

  const testRegister = async () => {
    setTestResult('Testing registration...');
    try {
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        role: 'patient'
      };

      const response = await authAPI.register(testUser);
      setTestResult({
        success: true,
        message: 'Registration test successful!',
        data: response
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Registration test failed'
      });
    }
  };

  const testLogin = async () => {
    setTestResult('Testing login...');
    try {
      // First register a test user
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'test123';
      
      await authAPI.register({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: testPassword,
        role: 'patient'
      });

      // Then try to login
      const response = await authAPI.login(testEmail, testPassword);
      setTestResult({
        success: true,
        message: 'Login test successful!',
        data: response
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Login test failed'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Backend Connection Test</h2>
          <p>Verify that frontend can connect to backend</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Status: {status}</h3>
          
          {healthStatus && (
            <div className={`message ${healthStatus.success ? 'success' : 'error'}`}>
              {healthStatus.message}
              {healthStatus.timestamp && (
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  {new Date(healthStatus.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={checkBackendHealth}
            className="auth-button"
            style={{ marginBottom: '10px' }}
          >
            Check Backend Health
          </button>
          
          <button 
            onClick={testRegister}
            className="auth-button"
            style={{ marginBottom: '10px', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
          >
            Test Registration
          </button>
          
          <button 
            onClick={testLogin}
            className="auth-button"
            style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}
          >
            Test Login
          </button>
        </div>

        {testResult && (
          <div className={`message ${testResult.success ? 'success' : 'error'}`}>
            {testResult.message}
            {testResult.data && (
              <div style={{ fontSize: '0.8rem', marginTop: '10px', textAlign: 'left' }}>
                <strong>Response:</strong>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '5px',
                  marginTop: '5px',
                  fontSize: '0.75rem',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="auth-footer">
          <p>
            <a href="/" className="auth-link">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackendTest;

