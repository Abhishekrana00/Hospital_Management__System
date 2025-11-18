# Hospital Management System - Backend API

Backend API for the Hospital Management System with authentication endpoints.

## Features

- User Registration
- User Login
- JWT Authentication
- Password Hashing (bcrypt)
- MongoDB Integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Adjust `PORT` if needed (default: 5000)

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient",
    "phone": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "user": { ... },
      "token": "jwt-token"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "user": { ... },
      "token": "jwt-token"
    }
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "user": { ... }
    }
  }
  ```

### Health Check

#### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Hospital Management API is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## User Roles

- `admin` - Administrator
- `doctor` - Doctor
- `nurse` - Nurse
- `receptionist` - Receptionist
- `patient` - Patient (default)

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs

