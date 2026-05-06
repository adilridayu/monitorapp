/**
 * Stock Movement Entity
 * Core entity for tracking all inventory changes
 * This is the single source of truth for stock levels
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

@Entity('stock_movements')
@Check(`"quantity" > 0`)
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  item_id: string;

  @ManyToOne(() => Item, (item) => item.stockMovements, { eager: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({
    type: 'uuid',
  })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stockMovements, { eager: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  @Index()
  movement_type: MovementType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 3,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  @Index()
  reference_number: string;

  @Column({
    type: 'uuid',
  })
  actor_id: string;

  @ManyToOne(() => User, (user) => user.stockMovements)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ValidationStatus,
    default: ValidationStatus.PENDING,
  })
  @Index()
  validation_status: ValidationStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'jsonb',
    default: {},
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // Helper methods
  isPending(): boolean {
    return this.validation_status === ValidationStatus.PENDING;
  }

  isValidated(): boolean {
    return this.validation_status === ValidationStatus.VALIDATED;
  }

  isRejected(): boolean {
    return this.validation_status === ValidationStatus.REJECTED;
  }

  isIncoming(): boolean {
    return this.movement_type === MovementType.IN ||
      (this.movement_type === MovementType.ADJUSTMENT && this.metadata?.adjustment_type === 'ADD') ||
      (this.movement_type === MovementType.TRANSFER && this.metadata?.transfer_direction === 'IN');
  }

  isOutgoing(): boolean {
    return this.movement_type === MovementType.OUT ||
      (this.movement_type === MovementType.ADJUSTMENT && this.metadata?.adjustment_type === 'SUBTRACT') ||
      (this.movement_type === MovementType.TRANSFER && this.metadata?.transfer_direction === 'OUT');
  }

  validate(): void {
    this.validation_status = ValidationStatus.VALIDATED;
  }

  reject(): void {
    this.validation_status = ValidationStatus.REJECTED;
  }
}