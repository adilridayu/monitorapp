/**
 * Audit Log Entity
 * Records all operational actions for full auditability
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
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Index()
  actor_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({
    type: 'varchar',
    length: 100,
  })
  @Index()
  action: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  @Index()
  entity_type: string;

  @Column({
    type: 'uuid',
  })
  @Index()
  entity_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  before_state: Record<string, any>;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  after_state: Record<string, any>;

  @Column({
    type: 'inet',
    nullable: true,
  })
  ip_address: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  user_agent: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Index()
  correlation_id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  created_at: Date;

  // Helper methods
  static createAction(
    actorId: string,
    entityType: string,
    entityId: string,
    beforeState?: any,
    afterState?: any,
    ipAddress?: string,
    userAgent?: string,
    correlationId?: string,
  ): Partial<AuditLog> {
    return {
      actor_id: actorId,
      action: 'CREATE',
      entity_type: entityType,
      entity_id: entityId,
      before_state: null,
      after_state: afterState,
      ip_address: ipAddress,
      user_agent: userAgent,
      correlation_id: correlationId,
    };
  }

  static updateAction(
    actorId: string,
    entityType: string,
    entityId: string,
    beforeState: any,
    afterState: any,
    ipAddress?: string,
    userAgent?: string,
    correlationId?: string,
  ): Partial<AuditLog> {
    return {
      actor_id: actorId,
      action: 'UPDATE',
      entity_type: entityType,
      entity_id: entityId,
      before_state: beforeState,
      after_state: afterState,
      ip_address: ipAddress,
      user_agent: userAgent,
      correlation_id: correlationId,
    };
  }

  static deleteAction(
    actorId: string,
    entityType: string,
    entityId: string,
    beforeState: any,
    ipAddress?: string,
    userAgent?: string,
    correlationId?: string,
  ): Partial<AuditLog> {
    return {
      actor_id: actorId,
      action: 'DELETE',
      entity_type: entityType,
      entity_id: entityId,
      before_state: beforeState,
      after_state: null,
      ip_address: ipAddress,
      user_agent: userAgent,
      correlation_id: correlationId,
    };
  }
}