"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const compression = __importStar(require("compression"));
const helmet = __importStar(require("helmet"));
const cookieParser = __importStar(require("cookie-parser"));
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logger_1 = require("./common/utils/logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'ws:', 'wss:'],
            },
        },
    }));
    app.use(compression());
    app.use(cookieParser());
    app.enableCors({
        origin: configService.get('CORS_ORIGINS', '*').split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        validationError: {
            target: false,
            value: false,
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Warehouse Intelligence API')
        .setDescription(`## Enterprise Warehouse Monitoring System

Sistem monitoring gudang enterprise-grade dengan AI-powered insights.

### Authentication
Use the authorize button to set your JWT token.

### Key Features
- Stock management with movement tracking
- AI-powered anomaly detection
- Real-time monitoring
- Approval workflows
- Comprehensive audit trails`)
        .setVersion('1.0.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('roles', 'Role management')
        .addTag('warehouses', 'Warehouse management')
        .addTag('items', 'Item/inventory management')
        .addTag('stock-movements', 'Stock movement operations')
        .addTag('monitoring', 'Monitoring schedules and logs')
        .addTag('ai-alerts', 'AI-generated alerts')
        .addTag('approvals', 'Approval workflow')
        .addTag('audit', 'Audit logs')
        .addBearerJwt()
        .addServer('/api/v1', 'API v1')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.enableShutdownHooks();
    process.on('SIGTERM', () => {
        logger_1.Logger.log('SIGTERM signal received: closing HTTP server');
        app.close();
        process.exit(0);
    });
    process.on('SIGINT', () => {
        logger_1.Logger.log('SIGINT signal received: closing HTTP server');
        app.close();
        process.exit(0);
    });
    const port = configService.get('PORT', 3000);
    const host = configService.get('HOST', '0.0.0.0');
    await app.listen(port, host, () => {
        logger_1.Logger.log(`🚀 Application started on http://${host}:${port}`);
        logger_1.Logger.log(`📚 API Documentation: http://${host}:${port}/docs`);
        logger_1.Logger.log(`🔗 WebSocket: ws://${host}:${port}/ws`);
    });
}
bootstrap().catch((error) => {
    logger_1.Logger.error('Failed to start application', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map