"""
AI Service Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Warehouse Intelligence AI Service"
    APP_ENV: str = "development"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database - PostgreSQL
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "warehouse_admin"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "warehouse_db"
    
    # Database - MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017/warehouse_ai"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = None
    
    # AI Service
    AI_SERVICE_URL: str = "http://localhost:8000"
    BACKEND_URL: str = "http://localhost:3000"
    
    # AI Models
    CONFIDENCE_THRESHOLD: float = 0.7
    ANOMALY_THRESHOLD: float = 0.8
    FORECAST_HORIZON: int = 30  # Days to forecast
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Scheduler
    ALERT_CHECK_INTERVAL_MINUTES: int = 15
    STOCK_CHECK_INTERVAL_MINUTES: int = 30
    FORECAST_GENERATION_INTERVAL_HOURS: int = 24
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @property
    def database_url(self) -> str:
        """PostgreSQL connection URL"""
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def async_database_url(self) -> str:
        """Async PostgreSQL connection URL"""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()