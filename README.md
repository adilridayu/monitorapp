# Warehouse Intelligence Monitoring System

Sistem monitoring gudang enterprise-grade dengan arsitektur AI sebagai penasihat dan manusia sebagai pengendali.

## 🏗️ Arsitektur Sistem

### Filosofi Sistem
- **Human-as-controller**: Manusia sebagai pengambil keputusan
- **AI-as-advisor**: AI hanya memberikan rekomendasi
- **Deterministic stock integrity**: Integritas stok yang deterministik
- **Full auditability**: Auditabilitas penuh
- **Explainable AI**: AI yang dapat dijelaskan
- **Real-time operational visibility**: Visibilitas operasional real-time
- **Event-driven architecture**: Arsitektur berbasis event
- **Zero-loss historical traceability**: Jejak historis tanpa kehilangan data

### Tech Stack

#### Backend
- **Node.js** + **TypeScript** + **NestJS**
- REST API + WebSocket untuk real-time
- JWT authentication + RBAC authorization

#### AI Service
- **Python** + **FastAPI**
- ML inference, anomaly detection, forecasting
- Statistical analysis

#### Databases
- **PostgreSQL**: Data transaksional relasional
- **MongoDB**: Logs, output AI, observability
- **Redis**: Caching, queue buffering, WebSocket scaling

#### Infrastructure
- **Docker** + **Docker Compose**
- **Kafka/RabbitMQ**: Message queue
- **Nginx**: Reverse proxy

#### Frontend
- **Flutter**: Cross-platform dashboard
- Real-time dashboard dengan role-based UI

## 📁 Struktur Proyek

```
monitoringapp/
├── backend/              # NestJS backend service
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication & Authorization
│   │   │   ├── users/          # User management
│   │   │   ├── roles/          # Role management
│   │   │   ├── warehouses/     # Warehouse management
│   │   │   ├── items/          # Item/inventory management
│   │   │   ├── stock-movements/ # Stock movement (core)
│   │   │   ├── monitoring/     # Monitoring schedules & logs
│   │   │   ├── ai-alerts/      # AI alert management
│   │   │   ├── approvals/      # Approval workflow
│   │   │   └── audit/          # Audit logging
│   │   ├── common/
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── filters/        # Exception filters
│   │   │   ├── guards/         # Auth guards
│   │   │   ├── interceptors/   # Request/response interceptors
│   │   │   └── pipes/          # Validation pipes
│   │   ├── config/             # Configuration
│   │   └── database/           # Database migrations & seeds
│   ├── test/
│   ├── Dockerfile
│   ├── package.json
│   └── nest-cli.json
│
├── ai-service/           # Python AI service
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # ML models
│   │   ├── services/     # Business logic
│   │   │   ├── anomaly_detection.py
│   │   │   ├── forecasting.py
│   │   │   ├── alert_generator.py
│   │   │   └── statistical_analysis.py
│   │   └── utils/        # Utilities
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py
│
├── frontend/             # Flutter frontend
│   ├── lib/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── services/
│   │   ├── models/
│   │   ├── providers/    # State management
│   │   └── utils/
│   ├── pubspec.yaml
│   └── Dockerfile (for web)
│
└── infrastructure/       # Infrastructure configuration
    ├── docker-compose.yml
    ├── nginx/
    │   └── nginx.conf
    ├── postgresql/
    │   └── init.sql
    ├── mongodb/
    ├── redis/
    └── kafka/
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+
- Flutter SDK (optional, for mobile development)

### Development Setup

1. **Clone dan setup awal**
```bash
cd monitoringapp
```

2. **Jalankan infrastructure dengan Docker**
```bash
cd infrastructure
docker-compose up -d
```

3. **Setup Backend**
```bash
cd ../backend
npm install
npm run migration:run
npm run seed
npm run start:dev
```

4. **Setup AI Service**
```bash
cd ../ai-service
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

5. **Setup Frontend**
```bash
cd ../frontend
flutter pub get
flutter run
```

### Production Deployment

```bash
cd infrastructure
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Database Schema

### PostgreSQL Tables

#### users
- id (UUID, PK)
- email (unique)
- password_hash
- full_name
- role_id (FK)
- warehouse_id (FK, nullable)
- is_active
- created_at
- updated_at
- deleted_at (soft delete)

#### roles
- id (UUID, PK)
- name (warehouse_staff, supervisor, admin, manager)
- permissions (JSON)
- created_at
- updated_at

#### warehouses
- id (UUID, PK)
- name
- code (unique)
- address
- is_active
- created_at
- updated_at

#### items
- id (UUID, PK)
- sku (unique)
- name
- description
- category
- unit_of_measure
- min_stock_level
- max_stock_level
- is_active
- created_at
- updated_at

#### stock_movements
- id (UUID, PK)
- item_id (FK)
- warehouse_id (FK)
- movement_type (IN, OUT, ADJUSTMENT, TRANSFER)
- quantity (decimal, always positive)
- reference_number
- actor_id (FK to users)
- timestamp
- validation_status (PENDING, VALIDATED, REJECTED)
- notes
- metadata (JSON)
- created_at

#### monitoring_schedules
- id (UUID, PK)
- warehouse_id (FK)
- frequency (DAILY, WEEKLY, MONTHLY)
- next_scheduled_date
- is_active
- created_by (FK to users)
- created_at

#### monitoring_logs
- id (UUID, PK)
- schedule_id (FK)
- warehouse_id (FK)
- inspector_id (FK to users)
- inspection_date
- result (PASS, FAIL, NEEDS_ATTENTION)
- notes
- anomalies (JSON)
- evidence_urls (JSON)
- created_at

#### ai_alerts
- id (UUID, PK)
- alert_type
- item_id (FK, nullable)
- warehouse_id (FK, nullable)
- severity (LOW, MEDIUM, HIGH, CRITICAL)
- confidence_score (0-1)
- reasoning (text explanation)
- recommendation
- evidence (JSON)
- model_metadata (JSON)
- status (PENDING, APPROVED, REJECTED, REVISED, RESOLVED)
- generated_at
- reviewed_by (FK to users, nullable)
- reviewed_at (nullable)

#### approvals
- id (UUID, PK)
- alert_id (FK to ai_alerts)
- decision (APPROVE, REJECT, REVISE)
- actor_id (FK to users)
- notes
- revision_comments
- created_at

### MongoDB Collections

#### ai_logs
- _id (ObjectId)
- alert_id (reference to PostgreSQL)
- model_name
- model_version
- input_features (document)
- output_prediction (document)
- execution_time_ms
- timestamp

#### observability_logs
- _id (ObjectId)
- service_name
- level (INFO, WARN, ERROR)
- message
- metadata (document)
- timestamp

#### analytics_snapshots
- _id (ObjectId)
- snapshot_type
- data (document)
- created_at

## 🔐 Security

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Password hashing dengan bcrypt

### Authorization
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Resource-level authorization

### Audit
- Semua aksi tercatat dengan actor, timestamp, dan before/after state
- Immutable audit trail
- Soft delete untuk semua entitas

## 📡 API Documentation

API documentation tersedia di:
- Development: `http://localhost:3000/api/docs`
- Production: `https://api.yourdomain.com/docs`

### Endpoints Utama

#### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

#### Stock Movements
- `GET /api/v1/stock-movements`
- `POST /api/v1/stock-movements`
- `GET /api/v1/stock-movements/:id`
- `POST /api/v1/stock-movements/:id/validate`

#### AI Alerts
- `GET /api/v1/ai-alerts`
- `GET /api/v1/ai-alerts/:id`
- `POST /api/v1/ai-alerts/:id/approve`
- `POST /api/v1/ai-alerts/:id/reject`

#### Monitoring
- `GET /api/v1/monitoring/schedules`
- `POST /api/v1/monitoring/logs`
- `GET /api/v1/monitoring/logs`

## 🔄 Event Flow

### Stock Movement Flow
1. User membuat stock movement (status: PENDING)
2. Sistem validasi (business rules check)
3. Jika valid → status: VALIDATED, stok diupdate
4. Jika tidak valid → status: REJECTED
5. AI menganalisis pattern untuk anomaly detection

### AI Alert Flow
1. AI service menganalisis data historis
2. Generate alert dengan confidence score
3. Alert masuk ke status PENDING
4. Supervisor review dan approve/reject
5. Jika approved → action diambil oleh user
6. Semua keputusan tercatat di audit trail

## 🛠️ Development Guidelines

### Code Style
- Backend: ESLint + Prettier
- AI Service: Black + isort
- Frontend: Dart format

### Testing
- Backend: Jest (unit & integration)
- AI Service: pytest
- Frontend: Flutter test

### CI/CD
- GitHub Actions untuk automated testing
- Docker build & push
- Deployment automation

## 📈 Monitoring & Observability

### Metrics
- API response times
- Database query performance
- AI model inference times
- WebSocket connection counts

### Logging
- Structured logging (JSON format)
- Correlation IDs untuk request tracing
- Log aggregation ke MongoDB

### Alerts
- System health monitoring
- Performance degradation alerts
- Anomaly detection alerts

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

## 📄 License

Proprietary - All rights reserved

## 📞 Support

Untuk pertanyaan teknis, hubungi tim development.