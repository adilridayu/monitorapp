/**
 * Monitoring Controller
 * HTTP endpoints for monitoring operations
 */

import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringSchedule } from './entities/monitoring-schedule.entity';
import { MonitoringLog } from './entities/monitoring-log.entity';

@Controller('monitoring')
export class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  // Schedule endpoints
  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() createScheduleDto: Partial<MonitoringSchedule>) {
    return this.monitoringService.createSchedule(createScheduleDto);
  }

  @Get('schedules')
  async findAllSchedules() {
    return this.monitoringService.findAllSchedules();
  }

  @Get('schedules/:id')
  async findOneSchedule(@Param('id') id: string) {
    return this.monitoringService.findOneSchedule(id);
  }

  // Log endpoints
  @Post('logs')
  @HttpCode(HttpStatus.CREATED)
  async createLog(@Body() createLogDto: Partial<MonitoringLog>) {
    return this.monitoringService.createLog(createLogDto);
  }

  @Get('logs')
  async findAllLogs() {
    return this.monitoringService.findAllLogs();
  }

  @Get('logs/:id')
  async findOneLog(@Param('id') id: string) {
    return this.monitoringService.findOneLog(id);
  }
}