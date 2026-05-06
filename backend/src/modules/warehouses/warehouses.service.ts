/**
 * Warehouses Service
 * Business logic for warehouse operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehousesRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = this.warehousesRepository.create(createWarehouseDto);
    return this.warehousesRepository.save(warehouse);
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehousesRepository.find();
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async update(id: string, updateWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    await this.warehousesRepository.update(id, updateWarehouseDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.warehousesRepository.delete(id);
  }
}