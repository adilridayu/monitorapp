"""
Warehouse Intelligence AI Service
Main Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings
from app.api.routes import router as api_router
from app.core.database import init_databases, close_databases
from app.services.scheduler import start_scheduler, stop_scheduler

# Configure structured logging
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("Starting AI Service...")
    await init_databases()
    await start_scheduler()
    logger.info("AI Service started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Service...")
    await stop_scheduler()
    await close_databases()
    logger.info("AI Service stopped")

# Create FastAPI application
app = FastAPI(
    title="Warehouse Intelligence AI Service",
    description="""
## AI-Powered Warehouse Intelligence

This service provides AI-powered analytics and predictions for warehouse operations.

### Features
- **Anomaly Detection**: Detect unusual patterns in stock movements
- **Demand Forecasting**: Predict future stock requirements
- **Stock Optimization**: Recommend optimal stock levels
- **Pattern Analysis**: Identify trends and patterns in warehouse operations

### AI Governance
All AI outputs are advisory only and require human validation before any operational action.
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-service",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Warehouse Intelligence AI Service",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.APP_ENV == "development",
        log_level="info",
    )