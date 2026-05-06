/**
 * Warehouse Intelligence Monitoring System
 * Root Application Module
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';

// Config
import { AppConfig } from './config/app.config';

// Database
import { DatabaseModule } from './database/database.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { ItemsModule } from './modules/items/items.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { AiAlertsModule } from './modules/ai-alerts/ai-alerts.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { AuditModule } from './modules/audit/audit.module';

// WebSocket
import { WebSocketGateway } from './common/gateways/websocket.gateway';

// Health check
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // ============================================
    // CONFIGURATION
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [AppConfig],
    }),

    // ============================================
    // DATABASE (PostgreSQL)
    // ============================================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'warehouse_admin'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
        database: configService.get<string>('POSTGRES_DB', 'warehouse_db'),
        autoLoadEntities: true,
        synchronize: false, // Use migrations in production
        logging: configService.get<string>('NODE_ENV') === 'development',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        subscribers: [__dirname + '/database/subscribers/*{.ts,.js}'],
        // Connection pooling
        extra: {
          max: configService.get<number>('DB_POOL_SIZE', 20),
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
        // SSL for production
        ssl: configService.get<string>('NODE_ENV') === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
      }),
      inject: [ConfigService],
    }),

    // ============================================
    // MONGODB (for logs and AI outputs)
    // ============================================
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/warehouse_logs'),
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),

    // ============================================
    // CACHE (Redis)
    // ============================================
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: configService.get<number>('CACHE_TTL', 300), // 5 minutes default
      }),
      inject: [ConfigService],
    }),

    // ============================================
    // RATE LIMITING
    // ============================================
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: configService.get<number>('RATE_LIMIT_TTL', 60) * 1000,
            limit: configService.get<number>('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // ============================================
    // SCHEDULING
    // ============================================
    ScheduleModule.forRoot(),

    // ============================================
    // APPLICATION MODULES
    // ============================================
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    WarehousesModule,
    ItemsModule,
    StockMovementsModule,
    MonitoringModule,
    AiAlertsModule,
    ApprovalsModule,
    AuditModule,
    HealthModule,
  ],
  providers: [WebSocketGateway],
})
export class AppModule {}