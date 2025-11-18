# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0 Sandbox)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority
   ```

## Option 2: Install MongoDB Locally

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a Windows service
4. Default connection: `mongodb://127.0.0.1:27017/hospital_management`

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Option 3: Docker (Easiest)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

This will start MongoDB in a container accessible at `mongodb://127.0.0.1:27017`

## Verify MongoDB is Running

```bash
# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port 27017

# Or try connecting with MongoDB shell
mongosh
```

## Troubleshooting

- **Connection Refused**: Make sure MongoDB service is running
- **Windows**: Check Services (services.msc) for MongoDB
- **Port 27017 in use**: Change port in MongoDB config or use different port

