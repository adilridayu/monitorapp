"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const config_1 = require("@nestjs/config");
exports.AppConfig = (0, config_1.registerAs)('app', () => ({
    name: process.env.APP_NAME || 'Warehouse Intelligence System',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
    postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'warehouse_admin',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'warehouse_db',
        poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 20,
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse_logs',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
        ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    },
    rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
    aiService: {
        url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
        confidenceThreshold: parseFloat(process.env.AI_CONFIDENCE_THRESHOLD) || 0.7,
        anomalyThreshold: parseFloat(process.env.AI_ANOMALY_THRESHOLD) || 0.8,
    },
    cors: {
        origins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json',
    },
}));
//# sourceMappingURL=app.config.js.map