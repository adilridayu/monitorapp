/**
 * AI Alert Entity
 * Represents AI-generated operational intelligence outputs
 * Alerts are advisory only and require human validation
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
import { Item } from '../../items/entities/item.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { Approval } from '../../approvals/entities/approval.entity';

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISED = 'REVISED',
  RESOLVED = 'RESOLVED',
}

@Entity('ai_alerts')
export class AiAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  @Index()
  alert_type: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  item_id: string;

  @ManyToOne(() => Item, (item) => item.aiAlerts, { nullable: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.aiAlerts, { nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  @Index()
  severity: AlertSeverity;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
  })
  confidence_score: number;

  @Column({
    type: 'text',
  })
  reasoning: string;

  @Column({
    type: 'text',
  })
  recommendation: string;

  @Column({
    type: 'jsonb',
    default: {},
  })
  evidence: Record<string, any>;

  @Column({
    type: 'jsonb',
    default: {},
  })
  model_metadata: Record<string, any>;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.PENDING,
  })
  @Index()
  status: AlertStatus;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  generated_at: Date;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  reviewed_by: string;

  @ManyToOne(() => User, (user) => user.reviewedAlerts, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: User;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  reviewed_at: Date;

  // Relations
  @OneToMany(() => Approval, (approval) => approval.alert)
  approvals: Approval[];

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
  isPending(): boolean {
    return this.status === AlertStatus.PENDING;
  }

  isApproved(): boolean {
    return this.status === AlertStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.status === AlertStatus.REJECTED;
  }

  isResolved(): boolean {
    return this.status === AlertStatus.RESOLVED;
  }

  requiresReview(): boolean {
    return this.status === AlertStatus.PENDING;
  }

  approve(userId: string): void {
    this.status = AlertStatus.APPROVED;
    this.reviewed_by = userId;
    this.reviewed_at = new Date();
  }

  reject(userId: string): void {
    this.status = AlertStatus.REJECTED;
    this.reviewed_by = userId;
    this.reviewed_at = new Date();
  }

  resolve(): void {
    this.status = AlertStatus.RESOLVED;
  }

  getSeverityLevel(): number {
    switch (this.severity) {
      case AlertSeverity.CRITICAL: return 4;
      case AlertSeverity.HIGH: return 3;
      case AlertSeverity.MEDIUM: return 2;
      case AlertSeverity.LOW: return 1;
      default: return 0;
    }
  }
}