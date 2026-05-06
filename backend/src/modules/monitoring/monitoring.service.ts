/**
 * Monitoring Service
 * Business logic for monitoring operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MonitoringSchedule } from './entities/monitoring-schedule.entity';
import { MonitoringLog } from './entities/monitoring-log.entity';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(MonitoringSchedule)
    private monitoringScheduleRepository: Repository<MonitoringSchedule>,
    @InjectRepository(MonitoringLog)
    private monitoringLogRepository: Repository<MonitoringLog>,
  ) {}

  // Monitoring Schedule operations
  async createSchedule(createScheduleDto: Partial<MonitoringSchedule>): Promise<MonitoringSchedule> {
    const schedule = this.monitoringScheduleRepository.create(createScheduleDto);
    return this.monitoringScheduleRepository.save(schedule);
  }

  async findAllSchedules(): Promise<MonitoringSchedule[]> {
    return this.monitoringScheduleRepository.find();
  }

  async findOneSchedule(id: string): Promise<MonitoringSchedule> {
    const schedule = await this.monitoringScheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Monitoring schedule with ID ${id} not found`);
    }
    return schedule;
  }

  // Monitoring Log operations
  async createLog(createLogDto: Partial<MonitoringLog>): Promise<MonitoringLog> {
    const log = this.monitoringLogRepository.create(createLogDto);
    return this.monitoringLogRepository.save(log);
  }

  async findAllLogs(): Promise<MonitoringLog[]> {
    return this.monitoringLogRepository.find();
  }

  async findOneLog(id: string): Promise<MonitoringLog> {
    const log = await this.monitoringLogRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Monitoring log with ID ${id} not found`);
    }
    return log;
  }
}