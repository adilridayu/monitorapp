/**
 * Monitoring Schedule Entity
 * Defines operational inspection cadence for warehouses
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { MonitoringLog } from './monitoring-log.entity';

export enum MonitoringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity('monitoring_schedules')
export class MonitoringSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  @Index()
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.monitoringSchedules)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: MonitoringFrequency,
  })
  frequency: MonitoringFrequency;

  @Column({
    type: 'date',
  })
  next_scheduled_date: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Index()
  is_active: boolean;

  @Column({
    type: 'uuid',
  })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  // Relations
  @OneToMany(() => MonitoringLog, (log) => log.schedule)
  logs: MonitoringLog[];

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
  isDue(): boolean {
    if (!this.is_active) return false;
    return new Date() >= new Date(this.next_scheduled_date);
  }

  isActive(): boolean {
    return this.is_active;
  }

  deactivate(): void {
    this.is_active = false;
  }

  activate(): void {
    this.is_active = true;
  }

  getNextScheduleDate(): Date {
    const current = new Date(this.next_scheduled_date);
    const next = new Date(current);

    switch (this.frequency) {
      case MonitoringFrequency.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case MonitoringFrequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case MonitoringFrequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  updateNextSchedule(): void {
    this.next_scheduled_date = this.getNextScheduleDate();
  }
}