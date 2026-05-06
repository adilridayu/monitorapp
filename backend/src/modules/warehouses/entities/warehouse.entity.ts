/**
 * Warehouse Entity
 * Represents physical warehouse locations
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
import { User } from '../../users/entities/user.entity';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { MonitoringSchedule } from '../../monitoring/entities/monitoring-schedule.entity';
import { MonitoringLog } from '../../monitoring/entities/monitoring-log.entity';
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  @Index()
  code: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'Indonesia',
  })
  country: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Index()
  is_active: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.warehouse)
  users: User[];

  @OneToMany(() => StockMovement, (movement) => movement.warehouse)
  stockMovements: StockMovement[];

  @OneToMany(() => MonitoringSchedule, (schedule) => schedule.warehouse)
  monitoringSchedules: MonitoringSchedule[];

  @OneToMany(() => MonitoringLog, (log) => log.warehouse)
  monitoringLogs: MonitoringLog[];

  @OneToMany(() => AiAlert, (alert) => alert.warehouse)
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
  get fullAddress(): string {
    const parts = [this.address, this.city, this.country].filter(Boolean);
    return parts.join(', ');
  }
}