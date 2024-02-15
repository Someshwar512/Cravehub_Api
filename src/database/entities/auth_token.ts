// AuthToken.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { User } from './User';
import { AuthClient } from './auth_client';

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  access_token: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: true })
  device_type: string;

  
  @ManyToOne(() => User, { onDelete: "CASCADE",onUpdate:"CASCADE" })
  @JoinColumn({ name: "user_id" })
  user_id: number;

  // Add other columns similarly according to the migration definition
  @Column({ nullable: true })
  device_token: string;

  @Column({ nullable: true, type: 'datetime' })
  access_token_expire_on: Date;

  @Column({ nullable: true, type: 'datetime' })
  refresh_token_expire_on: Date;

  @Column({ nullable: true })
  uuid: string;

  @Column({ nullable: true })
  device_unique_id: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_on: Date;
}
