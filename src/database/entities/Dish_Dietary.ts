import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dish } from './Dish';
import { Dietary } from './Dietary';

@Entity()
export class DishDietary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dish_id: number;

  @Column()
  dietary_id: number;

  @ManyToOne(() => Dish)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ManyToOne(() => Dietary)
  @JoinColumn({ name: 'dietary_id' })
  dietary: Dietary;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
