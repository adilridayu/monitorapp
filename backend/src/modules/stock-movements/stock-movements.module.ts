/**
 * Stock Movements Module
 * Manages stock movement tracking
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockMovementService } from './stock-movements.service';
import { StockMovementController } from './stock-movements.controller';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement])],
  controllers: [StockMovementController],
  providers: [StockMovementService],
  exports: [StockMovementService, TypeOrmModule],
})
export class StockMovementsModule {}