/**
 * AI Alerts Module
 * Manages AI-generated alerts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiAlertsService } from './ai-alerts.service';
import { AiAlertsController } from './ai-alerts.controller';
import { AiAlert } from './entities/ai-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiAlert])],
  controllers: [AiAlertsController],
  providers: [AiAlertsService],
  exports: [AiAlertsService, TypeOrmModule],
})
export class AiAlertsModule {}