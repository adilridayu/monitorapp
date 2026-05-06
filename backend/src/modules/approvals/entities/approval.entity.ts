/**
 * Approval Entity
 * Records human validation decisions for AI alerts
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
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';
import { User } from '../../users/entities/user.entity';

export enum ApprovalDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REVISE = 'REVISE',
}

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  @Index()
  alert_id: string;

  @ManyToOne(() => AiAlert, (alert) => alert.approvals)
  @JoinColumn({ name: 'alert_id' })
  alert: AiAlert;

  @Column({
    type: 'enum',
    enum: ApprovalDecision,
  })
  decision: ApprovalDecision;

  @Column({
    type: 'uuid',
  })
  @Index()
  actor_id: string;

  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  revision_comments: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  created_at: Date;

  // Helper methods
  isApproved(): boolean {
    return this.decision === ApprovalDecision.APPROVE;
  }

  isRejected(): boolean {
    return this.decision === ApprovalDecision.REJECT;
  }

  isRevised(): boolean {
    return this.decision === ApprovalDecision.REVISE;
  }
}