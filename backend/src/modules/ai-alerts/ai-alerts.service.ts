/**
 * AI Alerts Service
 * Business logic for AI alert operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AiAlert } from './entities/ai-alert.entity';

@Injectable()
export class AiAlertsService {
  constructor(
    @InjectRepository(AiAlert)
    private aiAlertsRepository: Repository<AiAlert>,
  ) {}

  async create(createAiAlertDto: Partial<AiAlert>): Promise<AiAlert> {
    const alert = this.aiAlertsRepository.create(createAiAlertDto);
    return this.aiAlertsRepository.save(alert);
  }

  async findAll(): Promise<AiAlert[]> {
    return this.aiAlertsRepository.find();
  }

  async findOne(id: string): Promise<AiAlert> {
    const alert = await this.aiAlertsRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`AI alert with ID ${id} not found`);
    }
    return alert;
  }

  async update(id: string, updateAiAlertDto: Partial<AiAlert>): Promise<AiAlert> {
    await this.aiAlertsRepository.update(id, updateAiAlertDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.aiAlertsRepository.delete(id);
  }
}