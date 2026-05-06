/**
 * AI Alerts Controller
 * HTTP endpoints for AI alert operations
 */

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AiAlertsService } from './ai-alerts.service';
import { AiAlert } from './entities/ai-alert.entity';

@Controller('ai-alerts')
export class AiAlertsController {
  constructor(private aiAlertsService: AiAlertsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAiAlertDto: Partial<AiAlert>): Promise<AiAlert> {
    return this.aiAlertsService.create(createAiAlertDto);
  }

  @Get()
  async findAll(): Promise<AiAlert[]> {
    return this.aiAlertsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AiAlert> {
    return this.aiAlertsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAiAlertDto: Partial<AiAlert>): Promise<AiAlert> {
    return this.aiAlertsService.update(id, updateAiAlertDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.aiAlertsService.remove(id);
  }
}