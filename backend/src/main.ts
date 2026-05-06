/**
 * Warehouse Intelligence Monitoring System
 * Main Application Entry Point
 * 
 * This is the primary entry point for the NestJS backend application.
 * It configures the application with all necessary middleware, pipes,
 * filters, and global settings.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Logger } from './common/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // ============================================
  // GLOBAL MIDDLEWARE
  // ============================================
  
  // Security headers
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

  // Compression
  app.use(compression());

  // Cookie parser
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', '*').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  // ============================================
  // GLOBAL PIPES
  // ============================================
  
  app.useGlobalPipes(
    new ValidationPipe({
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
    }),
  );

  // ============================================
  // GLOBAL FILTERS & INTERCEPTORS
  // ============================================
  
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ============================================
  // API PREFIX
  // ============================================
  
  app.setGlobalPrefix('api/v1');

  // ============================================
  // SWAGGER DOCUMENTATION
  // ============================================
  
  const config = new DocumentBuilder()
    .setTitle('Warehouse Intelligence API')
    .setDescription(
      `## Enterprise Warehouse Monitoring System

Sistem monitoring gudang enterprise-grade dengan AI-powered insights.

### Authentication
Use the authorize button to set your JWT token.

### Key Features
- Stock management with movement tracking
- AI-powered anomaly detection
- Real-time monitoring
- Approval workflows
- Comprehensive audit trails`,
    )
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ============================================
  // SHUTDOWN HOOKS
  // ============================================
  
  app.enableShutdownHooks();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    Logger.log('SIGTERM signal received: closing HTTP server');
    app.close();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    Logger.log('SIGINT signal received: closing HTTP server');
    app.close();
    process.exit(0);
  });

  // ============================================
  // START APPLICATION
  // ============================================
  
  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host, () => {
    Logger.log(`🚀 Application started on http://${host}:${port}`);
    Logger.log(`📚 API Documentation: http://${host}:${port}/docs`);
    Logger.log(`🔗 WebSocket: ws://${host}:${port}/ws`);
  });
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error);
  process.exit(1);
});