# Warehouse Intelligence - Installation Guide

## Prerequisites

### Required Software
- **Node.js** 18+ (https://nodejs.org)
- **Python** 3.9+ (https://www.python.org)
- **Docker Desktop** (optional, for containerized deployment)
- **PostgreSQL** 15 (if not using Docker)
- **MongoDB** 7 (if not using Docker)
- **Redis** 7 (if not using Docker)

## Quick Start (Development)

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
Copy-Item .env.example .env

# Run database migrations (if using local PostgreSQL)
npm run migration:run

# Seed initial data
npm run seed

# Start development server
npm run start:dev
```

Backend will be available at: http://localhost:3000
API Documentation: http://localhost:3000/docs

### 2. AI Service Setup

```powershell
# Navigate to AI service directory
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start AI service
uvicorn main:app --reload
```

AI Service will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install Flutter dependencies
flutter pub get

# Run the app
flutter run
```

## Docker Deployment (Recommended)

### Using Docker Compose

```powershell
# Navigate to infrastructure directory
cd infrastructure

# Copy environment file
Copy-Item .env.example .env

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Services Started
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379
- RabbitMQ: localhost:5672 (Management: localhost:15672)
- Backend API: localhost:3000
- AI Service: localhost:8000
- Nginx: localhost:80

## Database Setup (Manual)

If not using Docker, manually set up databases:

### PostgreSQL
```sql
-- Create database
CREATE DATABASE warehouse_db;

-- Run initialization script
\i infrastructure/postgresql/init.sql
```

### MongoDB
```javascript
// Connect to MongoDB
mongo

// Run initialization script
use warehouse_logs
db.runCommand({ eval: load("infrastructure/mongodb/init.js") })
```

## Configuration

### Environment Variables

Create a `.env` file in the `infrastructure` directory:

```env
# Database
POSTGRES_USER=warehouse_admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=warehouse_db

# MongoDB
MONGO_USER=mongo_admin
MONGO_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_characters
REFRESH_TOKEN_SECRET=your_refresh_secret_minimum_32_characters
```

## Default Credentials

After running database seeds:
- **Email:** admin@warehouse.com
- **Password:** admin123

⚠️ **Important:** Change these credentials immediately in production!

## Troubleshooting

### npm install fails
If you encounter package version issues, the package.json has been updated with compatible versions:
- `cache-manager-redis-yet` instead of `cache-manager-redis-store`

### Port already in use
If ports are already in use, update the port numbers in:
- `infrastructure/.env`
- `backend/.env`
- `ai-service/.env`

### Database connection issues
Ensure PostgreSQL, MongoDB, and Redis are running:
```powershell
# Check if services are running
Get-Service -Name postgresql*
Get-Service -Name MongoDB
Get-Service -Name Redis
```

## Production Deployment

### Environment-specific configuration
Create `.env.production` files with production settings.

### Build for production

**Backend:**
```bash
npm run build
npm run start:prod
```

**AI Service:**
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend:**
```bash
flutter build web --release
# or
flutter build apk --release
```

## Support

For issues and questions:
1. Check the main README.md
2. Review API documentation at /docs endpoints
3. Check logs: `docker compose logs [service_name]`

## Next Steps

After successful installation:
1. Access the API documentation at http://localhost:3000/docs
2. Login with default credentials
3. Create additional users and warehouses
4. Configure AI service settings
5. Set up monitoring and alerts