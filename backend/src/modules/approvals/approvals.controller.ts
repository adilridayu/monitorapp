/**
 * Approvals Controller
 * HTTP endpoints for approval operations
 */

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { Approval } from './entities/approval.entity';

@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createApprovalDto: Partial<Approval>): Promise<Approval> {
    return this.approvalsService.create(createApprovalDto);
  }

  @Get()
  async findAll(): Promise<Approval[]> {
    return this.approvalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Approval> {
    return this.approvalsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateApprovalDto: Partial<Approval>): Promise<Approval> {
    return this.approvalsService.update(id, updateApprovalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.approvalsService.remove(id);
  }
}