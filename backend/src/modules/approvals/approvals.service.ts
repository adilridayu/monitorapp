/**
 * Approvals Service
 * Business logic for approval operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Approval } from './entities/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private approvalsRepository: Repository<Approval>,
  ) {}

  async create(createApprovalDto: Partial<Approval>): Promise<Approval> {
    const approval = this.approvalsRepository.create(createApprovalDto);
    return this.approvalsRepository.save(approval);
  }

  async findAll(): Promise<Approval[]> {
    return this.approvalsRepository.find();
  }

  async findOne(id: string): Promise<Approval> {
    const approval = await this.approvalsRepository.findOne({ where: { id } });
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }
    return approval;
  }

  async update(id: string, updateApprovalDto: Partial<Approval>): Promise<Approval> {
    await this.approvalsRepository.update(id, updateApprovalDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.approvalsRepository.delete(id);
  }
}