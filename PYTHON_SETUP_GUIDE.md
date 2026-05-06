# Python Setup Guide for Windows

## ⚠️ Python Not Found

If you see "Python was not found" error, you need to install Python first.

## Option 1: Install Python (Recommended)

### Step 1: Download Python
1. Go to https://www.python.org/downloads/
2. Download Python 3.9 or higher (latest stable version recommended)
3. **IMPORTANT:** During installation, check the box "Add Python to PATH"

### Step 2: Verify Installation
Open a new PowerShell window and run:
```powershell
python --version
```
You should see: `Python 3.9.x` or higher

### Step 3: Setup Virtual Environment
```powershell
# Navigate to ai-service directory
cd C:\Users\adilr\Downloads\monitoringapp\ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an error about execution policy, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt

# Start the AI service
uvicorn main:app --reload
```

## Option 2: Use Docker (No Python Required)

If you don't want to install Python, use Docker to run the AI service:

```powershell
# Navigate to infrastructure directory
cd C:\Users\adilr\Downloads\monitoringapp\infrastructure

# Start all services including AI service in Docker
docker compose up -d ai-service

# View logs
docker compose logs -f ai-service
```

## Option 3: Skip AI Service (Development Only)

For initial development, you can skip the AI service and only run the backend:

```powershell
# Backend only
cd backend
npm install
npm run start:dev
```

The backend will work without AI features, but AI-powered alerts and predictions won't be available.

## Troubleshooting

### "python" not recognized
- Make sure Python is installed with "Add to PATH" option checked
- Open a new terminal after installing Python
- Try `py --version` instead of `python --version`

### Virtual environment activation fails
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### pip not found
After activating virtual environment, pip should be available. If not:
```powershell
python -m pip install --upgrade pip
```

## Quick Start Without Python

If you want to get started quickly without installing Python:

1. **Start Backend Only:**
```powershell
cd backend
npm install
npm run start:dev
```

2. **Access API:**
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/docs

3. **AI Features:**
- AI features will be unavailable until you set up Python or use Docker
- Basic warehouse operations will work normally

## Recommended Approach

For full functionality, we recommend:

1. Install Python 3.9+ from python.org
2. Follow the virtual environment setup steps above
3. Run both backend and AI service

Or use Docker for the easiest setup:
```powershell
cd infrastructure
Copy-Item .env.example .env
docker compose up -d
```

This will start all services including PostgreSQL, MongoDB, Redis, RabbitMQ, Backend, and AI Service.