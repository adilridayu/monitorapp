/**
 * User Entity
 * Represents authenticated users in the system
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { MonitoringLog } from '../../monitoring/entities/monitoring-log.entity';
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';
import { Approval } from '../../approvals/entities/approval.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @Index()
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false, // Don't include in queries by default
  })
  password_hash: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  full_name: string;

  @Column({
    type: 'uuid',
  })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.users, { nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Index()
  is_active: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  last_login: Date;

  // Relations
  @OneToMany(() => StockMovement, (movement) => movement.actor)
  stockMovements: StockMovement[];

  @OneToMany(() => MonitoringLog, (log) => log.inspector)
  monitoringLogs: MonitoringLog[];

  @OneToMany(() => AiAlert, (alert) => alert.reviewedBy)
  reviewedAlerts: AiAlert[];

  @OneToMany(() => Approval, (approval) => approval.actor)
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

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deleted_at: Date;

  // Helper methods
  get isAdmin(): boolean {
    return this.role?.name === 'admin';
  }

  get isManager(): boolean {
    return this.role?.name === 'manager';
  }

  get isSupervisor(): boolean {
    return this.role?.name === 'supervisor';
  }

  get isStaff(): boolean {
    return this.role?.name === 'warehouse_staff';
  }

  hasPermission(resource: string, action: string): boolean {
    if (this.isAdmin) return true;
    
    const permissions = this.role?.permissions || {};
    const resourcePermissions = permissions[resource];
    
    if (!resourcePermissions) return false;
    return resourcePermissions.includes(action) || resourcePermissions.includes('*');
  }
}