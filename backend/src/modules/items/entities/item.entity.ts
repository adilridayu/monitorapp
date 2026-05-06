/**
 * Item Entity
 * Represents inventory items stored in warehouses
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  @Index()
  sku: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  category: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'UNIT',
  })
  unit_of_measure: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 3,
    default: 0,
  })
  min_stock_level: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 3,
    nullable: true,
  })
  max_stock_level: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Index()
  is_active: boolean;

  // Relations
  @OneToMany(() => StockMovement, (movement) => movement.item)
  stockMovements: StockMovement[];

  @OneToMany(() => AiAlert, (alert) => alert.item)
  aiAlerts: AiAlert[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Helper methods
  isLowStock(currentQuantity: number): boolean {
    return currentQuantity <= this.min_stock_level;
  }

  isOverstock(currentQuantity: number): boolean {
    return this.max_stock_level !== null && currentQuantity >= this.max_stock_level;
  }

  getStockStatus(currentQuantity: number): 'LOW' | 'NORMAL' | 'OVERSTOCK' {
    if (this.isLowStock(currentQuantity)) return 'LOW';
    if (this.isOverstock(currentQuantity)) return 'OVERSTOCK';
    return 'NORMAL';
  }
}