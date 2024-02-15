import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dish } from './Dish';
import { Ingredients } from './Ingredients';

@Entity()
export class DishIngredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ingredients_id: number;

  @Column()
  dish_id: number;

  // @ManyToOne(() => Ingredients)
  // @JoinColumn({ name: 'ingredients_id' })
  // ingredient: Ingredients;

  @ManyToOne(() => Dish)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
