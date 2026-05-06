/**
 * Audit Controller
 * HTTP endpoints for audit operations
 */

import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuditLogDto: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditService.create(createAuditLogDto);
  }

  @Get()
  async findAll(@Query('entityType') entityType?: string, @Query('entityId') entityId?: string): Promise<AuditLog[]> {
    if (entityType && entityId) {
      return this.auditService.findByEntity(entityType, entityId);
    }
    return this.auditService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AuditLog> {
    return this.auditService.findOne(id);
  }
}