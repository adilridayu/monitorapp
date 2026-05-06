/**
 * Role Entity
 * Represents user roles with associated permissions
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum UserRole {
  WAREHOUSE_STAFF = 'warehouse_staff',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    unique: true,
  })
  name: UserRole;

  @Column({
    type: 'jsonb',
    default: {},
  })
  permissions: Record<string, string[]>;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

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
}