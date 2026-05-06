/**
 * Stock Movements Controller
 * HTTP endpoints for stock movement operations
 */

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { StockMovementService } from './stock-movements.service';
import { StockMovement } from './entities/stock-movement.entity';

@Controller('stock-movements')
export class StockMovementController {
  constructor(private stockMovementService: StockMovementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStockMovementDto: Partial<StockMovement>): Promise<StockMovement> {
    return this.stockMovementService.create(createStockMovementDto);
  }

  @Get()
  async findAll(): Promise<StockMovement[]> {
    return this.stockMovementService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StockMovement> {
    return this.stockMovementService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStockMovementDto: Partial<StockMovement>): Promise<StockMovement> {
    return this.stockMovementService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockMovementService.remove(id);
  }
}