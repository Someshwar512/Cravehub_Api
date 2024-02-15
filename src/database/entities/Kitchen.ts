import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { Zipcode } from '../entities/Zipcode';
@Entity()
export class Kitchen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar',  nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true})
  description: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  zipcode_id: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'int', nullable: true })
  chef_id: number;

  @Column({ type: 'text', nullable: false })
  chef_descriptions: string;

  @Column({ type: 'text', nullable: false })
  food_pick_up_instructions: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_earnings: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @ManyToOne(() => Zipcode)
  @JoinColumn({ name: 'zipcode_id' })
  zipcode: Zipcode;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'chef_id' })
  chef: User;

  // @OneToOne(() => User, user => user.kitchen)
  // user: User;
}
