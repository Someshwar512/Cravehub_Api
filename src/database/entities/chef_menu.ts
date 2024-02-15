import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany } from 'typeorm';
import { User } from './User';
import { Dish } from './Dish';
import { PickupWindow } from './pickup_window';
import { Reviews } from './reviews';
import { Order } from './order_table';

@Entity()
export class ChefMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  servings: number;

  @ManyToOne(() => User, user => user.chefMenus)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Dish, dish => dish.chefMenus)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ManyToOne(() => PickupWindow, pickupWindow => pickupWindow.chefMenus)
  @JoinColumn({ name: 'window_id' })
  pickupWindow: PickupWindow;

  @Column({ type: 'date' })
  orderby_date: string;

  @Column({ type: 'time' })
  orderby_time: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

//   @OneToMany(() => Reviews, (reviews) => reviews.chefMenu)
//   reviews: Reviews[];

 // Define a relation to Reviews through Dish
 @OneToMany(() => Reviews, (reviews) => reviews.dish)
 reviews: Reviews[];



}
