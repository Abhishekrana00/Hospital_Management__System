const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper function to get headers with auth token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() || 'An error occurred' };
    }
    
    if (!response.ok) {
      // Better error message for 404
      if (response.status === 404) {
        throw new Error(data.message || `Route not found: ${url}`);
      }
      throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Cannot connect to backend server. Make sure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Register a new patient (patient role only)
  registerPatient: async (patientData) => {
    return apiRequest('/auth/register/patient', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
};

// Appointments API
export const appointmentsAPI = {
  // Book a new appointment
  bookAppointment: async (appointmentData) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get user's appointments
  getAppointments: async () => {
    return apiRequest('/appointments', {
      method: 'GET',
    });
  },

  // Get single appointment
  getAppointment: async (id) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'GET',
    });
  },

  // Update appointment (cancel for patients, status update for staff)
  updateAppointment: async (id, data) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get available doctors
  getAvailableDoctors: async (department, date, time) => {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (date) params.append('date', date);
    if (time) params.append('time', time);
    const query = params.toString();
    return apiRequest(`/appointments/doctors/available${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // Get doctor count
  getDoctorCount: async () => {
    return apiRequest('/appointments/doctors/count', {
      method: 'GET',
    });
  },

  // Get list of all doctors
  getDoctorsList: async () => {
    return apiRequest('/appointments/doctors/list', {
      method: 'GET',
    });
  },

  // Get available time slots for a doctor on a specific date
  getAvailableTimes: async (doctorId, date) => {
    const params = new URLSearchParams();
    params.append('doctorId', doctorId);
    params.append('date', date);
    return apiRequest(`/appointments/available-times?${params.toString()}`, {
      method: 'GET',
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health', {
    method: 'GET',
  });
};

export default {
  authAPI,
  appointmentsAPI,
  healthCheck,
  setToken,
  removeToken,
  getToken,
};

