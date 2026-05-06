# Warehouse Intelligence Monitoring System - Complete Setup Guide

This guide will help you set up and run the complete monitoring system with all its components.

## Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+ (for AI service)
- **Docker** and **Docker Compose** (optional, for containerized deployment)
- **PostgreSQL** 14+ (or use Docker)
- **MongoDB** 6+ (or use Docker)
- **Redis** 7+ (or use Docker)

## Quick Start (Development)

### 1. Database Setup

#### Option A: Using Docker (Recommended)
```bash
cd infrastructure
docker-compose up -d postgres mongodb redis
```

#### Option B: Manual Installation
Install PostgreSQL, MongoDB, and Redis separately and update the `.env` file accordingly.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file (already created)
# The .env file has been created with default values

# Run database migrations (if using TypeORM migrations)
npm run migration:run

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 3. AI Service Setup

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the AI service
python main.py
```

The AI service will be available at `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend

# Get Flutter dependencies
flutter pub get

# Run the app
flutter run
```

Or if you prefer to run on a specific device:
```bash
flutter run -d chrome  # For web
flutter run -d windows # For Windows desktop
```

## Configuration

### Environment Variables

The application uses environment variables defined in `.env` files:

#### Backend (.env)
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `MONGODB_URI`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `NODE_ENV`

#### Frontend
The frontend configuration is in `frontend/lib/core/config/app_config.dart`

## Testing the Application

### 1. Test Login
- Open the Flutter app
- Use demo credentials:
  - Email: `demo@warehouse.com`
  - Password: `demo123`
- Or any valid email/password combination (demo mode)

### 2. Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@warehouse.com","password":"demo123"}'
```

### 3. Test AI Service
```bash
curl http://localhost:8000/health
```

## Troubleshooting

### Common Issues

1. **"Cannot find module '@nestjs/typeorm'" errors**
   - Run `npm install` in the backend directory
   - These are TypeScript errors that will resolve after installing dependencies

2. **Database connection errors**
   - Ensure PostgreSQL, MongoDB, and Redis are running
   - Check the `.env` file for correct connection strings
   - Verify database credentials

3. **Port already in use**
   - Change the port in `.env` file or stop other services using those ports

4. **Flutter pub get fails**
   - Ensure Flutter SDK is properly installed
   - Run `flutter doctor` to check Flutter installation
   - Try `flutter clean` and then `flutter pub get`

5. **Python dependencies fail**
   - Ensure you're using Python 3.9+
   - Try upgrading pip: `pip install --upgrade pip`
   - Install required system packages for some Python libraries

## Production Deployment

For production deployment, use Docker Compose:

```bash
cd infrastructure
docker-compose up -d
```

This will start all services in containers with proper networking and configuration.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service    │
│  (Flutter)      │◄──►│   (NestJS)      │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ - Login         │    │ - Auth          │    │ - Anomaly       │
│ - Dashboard     │    │ - Users         │    │ - Forecasting   │
│ - Stock         │    │ - Stock         │    │ - Alerts        │
│ - Alerts        │    │ - Monitoring    │    │                 │
│ - Monitoring    │    │ - AI Alerts     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   Databases     │
                     │                 │
                     │ - PostgreSQL    │
                     │ - MongoDB       │
                     │ - Redis         │
                     └─────────────────┘
```

## Next Steps

1. **Customize Configuration**: Update `.env` files with your specific settings
2. **Set up Authentication**: Configure JWT secrets and authentication providers
3. **Configure AI Models**: Set up machine learning models for anomaly detection
4. **Set up Notifications**: Configure email/Slack notifications for alerts
5. **Deploy to Production**: Use Docker Compose or Kubernetes for production deployment

## Support

For issues and questions:
1. Check the logs in each service
2. Review the API documentation (Swagger UI at `http://localhost:3000/api`)
3. Consult the individual service README files

---

**Note**: This is a demonstration/development setup. For production, ensure proper security measures, SSL certificates, and environment-specific configurations are in place.