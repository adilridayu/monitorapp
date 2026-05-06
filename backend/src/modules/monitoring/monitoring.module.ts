/**
 * Monitoring Module
 * Manages monitoring schedules and logs
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { MonitoringSchedule } from './entities/monitoring-schedule.entity';
import { MonitoringLog } from './entities/monitoring-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonitoringSchedule, MonitoringLog])],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService, TypeOrmModule],
})
export class MonitoringModule {}