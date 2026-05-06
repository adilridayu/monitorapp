/**
 * Database Module
 * Configures PostgreSQL and MongoDB connections
 */

import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Schemas
import { AiLog, AiLogSchema } from './schemas/ai-log.schema';
import { ObservabilityLog, ObservabilityLogSchema } from './schemas/observability-log.schema';

// Entities
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Warehouse } from '../modules/warehouses/entities/warehouse.entity';
import { Item } from '../modules/items/entities/item.entity';
import { StockMovement } from '../modules/stock-movements/entities/stock-movement.entity';
import { MonitoringSchedule } from '../modules/monitoring/entities/monitoring-schedule.entity';
import { MonitoringLog } from '../modules/monitoring/entities/monitoring-log.entity';
import { AiAlert } from '../modules/ai-alerts/entities/ai-alert.entity';
import { Approval } from '../modules/approvals/entities/approval.entity';
import { AuditLog } from '../modules/audit/entities/audit-log.entity';

@Global()
@Module({
  imports: [
    // PostgreSQL TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'warehouse_admin'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
        database: configService.get<string>('POSTGRES_DB', 'warehouse_db'),
        entities: [
          Role,
          User,
          Warehouse,
          Item,
          StockMovement,
          MonitoringSchedule,
          MonitoringLog,
          AiAlert,
          Approval,
          AuditLog,
        ],
        synchronize: false, // Use migrations in production
        logging: configService.get<string>('NODE_ENV') === 'development',
        migrationsRun: false,
        migrationsTransactionMode: 'each',
      }),
      inject: [ConfigService],
    }),

    // MongoDB Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/warehouse_logs'),
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),

    // MongoDB Collections
    MongooseModule.forFeature([
      { name: AiLog.name, schema: AiLogSchema },
      { name: ObservabilityLog.name, schema: ObservabilityLogSchema },
    ]),
  ],
  exports: [TypeOrmModule, MongooseModule],
})
export class DatabaseModule {}