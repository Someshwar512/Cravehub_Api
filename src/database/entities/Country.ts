import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from '../entities/State';
import { Status } from '../../constant';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  short_name: string;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @OneToMany(() => State, state => state.country)
  states: State[];

  
}
