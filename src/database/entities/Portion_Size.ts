// PortionSize.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,OneToMany} from 'typeorm';
import { Dish } from './Dish';
@Entity()
export class PortionSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

  @OneToMany(() => Dish, (dish) => dish.portion_size)
  dishes: Dish[];
}
