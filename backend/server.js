const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');

// Import auto-cancel scheduler
const { startAutoCancelScheduler } = require('./utils/autoCancelAppointments');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    // Try 127.0.0.1 first (works better on Windows), fallback to localhost
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_management';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('⚠️  Make sure MongoDB is running or update MONGODB_URI in .env file');
    console.error('💡 Options:');
    console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.error('   3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.error('⚠️  Server will continue but database operations will fail');
    // Don't exit - allow server to start even without DB for testing
  }
};

connectDB();

// Start auto-cancel scheduler for appointments
startAutoCancelScheduler();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Debug: Log registered routes
console.log('📋 Registered routes:');
console.log('   POST /api/appointments - Book appointment');
console.log('   GET  /api/appointments - Get appointments');
console.log('   GET  /api/appointments/doctors/available - Get available doctors');
console.log('   GET  /api/appointments/available-times - Get available time slots');
console.log('   GET  /api/appointments/doctors/count - Get doctor count');
console.log('   GET  /api/appointments/doctors/list - Get doctors list');
console.log('   GET  /api/appointments/:id - Get single appointment');
console.log('   PUT  /api/appointments/:id - Update appointment');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hospital Management API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;

