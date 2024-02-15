// Membership.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
}
