/**
 * Warehouses Controller
 * HTTP endpoints for warehouse operations
 */

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { WarehouseService } from './warehouses.service';
import { Warehouse } from './entities/warehouse.entity';

@Controller('warehouses')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  async findAll(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehouseService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.warehouseService.remove(id);
  }
}