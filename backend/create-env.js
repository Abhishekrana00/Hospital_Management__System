const fs = require('fs');
const path = require('path');

const envContent = `MONGODB_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=your-secret-key-change-this-in-production-12345
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('⚠️  .env file already exists');
}

