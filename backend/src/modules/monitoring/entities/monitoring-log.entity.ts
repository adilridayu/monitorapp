/**
 * Monitoring Log Entity
 * Records actual monitoring execution and inspection results
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MonitoringSchedule } from './monitoring-schedule.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';

export enum InspectionResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
}

@Entity('monitoring_logs')
export class MonitoringLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  schedule_id: string;

  @ManyToOne(() => MonitoringSchedule, (schedule) => schedule.logs, { nullable: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: MonitoringSchedule;

  @Column({
    type: 'uuid',
  })
  @Index()
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.monitoringLogs)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    type: 'uuid',
  })
  @Index()
  inspector_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  inspection_date: Date;

  @Column({
    type: 'enum',
    enum: InspectionResult,
  })
  @Index()
  result: InspectionResult;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'jsonb',
    default: [],
  })
  anomalies: Array<{
    type: string;
    description: string;
    severity: string;
    location?: string;
  }>;

  @Column({
    type: 'jsonb',
    default: [],
  })
  evidence_urls: string[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // Helper methods
  isPassed(): boolean {
    return this.result === InspectionResult.PASS;
  }

  isFailed(): boolean {
    return this.result === InspectionResult.FAIL;
  }

  needsAttention(): boolean {
    return this.result === InspectionResult.NEEDS_ATTENTION;
  }

  hasAnomalies(): boolean {
    return this.anomalies && this.anomalies.length > 0;
  }

  addAnomaly(anomaly: {
    type: string;
    description: string;
    severity: string;
    location?: string;
  }): void {
    if (!this.anomalies) {
      this.anomalies = [];
    }
    this.anomalies.push(anomaly);
  }

  addEvidence(url: string): void {
    if (!this.evidence_urls) {
      this.evidence_urls = [];
    }
    this.evidence_urls.push(url);
  }
}