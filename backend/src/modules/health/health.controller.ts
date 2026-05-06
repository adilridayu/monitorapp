/**
 * Health Controller
 * Provides health check endpoints
 */

import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckError,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    try {
      const result = await this.health.check([
        // Database checks
        async () => this.db.pingCheck('postgres'),
        async () => this.mongo.pingCheck('mongodb'),
        
        // Memory check (max 150MB used)
        async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        
        // Disk check (max 50% used)
        async () => this.disk.checkStorage('storage', { thresholdPercent: 0.5, path: '/' }),
      ]);
      return result;
    } catch (error) {
      if (error instanceof HealthCheckError) {
        throw error;
      }
      throw error;
    }
  }

  @Get('ready')
  async readiness(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  @Get('live')
  async liveness(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}