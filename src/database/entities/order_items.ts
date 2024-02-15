// OrderItems.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,OneToMany } from 'typeorm';

import { Dish } from './Dish';
import { Order } from './order_table';
import { Reviews } from './reviews';
import { User } from './User';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Dish, dish => dish.orderItems)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;



  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dish_price: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

  @OneToMany(() => OrderItems, orderItems => orderItems.order)
  orderItems: OrderItems[];

  @OneToMany(() => Reviews, reviews => reviews.order)
  reviews: Reviews[];

 
  @ManyToOne(() => User, (user) => user.chefMenus)
  user: User;

}
