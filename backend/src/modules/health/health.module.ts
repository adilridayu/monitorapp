/**
 * Health Module
 * Provides health check endpoints for monitoring
 */

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    TypeOrmModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/warehouse_logs'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}