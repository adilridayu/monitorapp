/**
 * Stock Movements Service
 * Business logic for stock movement operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StockMovement } from './entities/stock-movement.entity';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private stockMovementsRepository: Repository<StockMovement>,
  ) {}

  async create(createStockMovementDto: Partial<StockMovement>): Promise<StockMovement> {
    const stockMovement = this.stockMovementsRepository.create(createStockMovementDto);
    return this.stockMovementsRepository.save(stockMovement);
  }

  async findAll(): Promise<StockMovement[]> {
    return this.stockMovementsRepository.find();
  }

  async findOne(id: string): Promise<StockMovement> {
    const stockMovement = await this.stockMovementsRepository.findOne({ where: { id } });
    if (!stockMovement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }
    return stockMovement;
  }

  async update(id: string, updateStockMovementDto: Partial<StockMovement>): Promise<StockMovement> {
    await this.stockMovementsRepository.update(id, updateStockMovementDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.stockMovementsRepository.delete(id);
  }
}