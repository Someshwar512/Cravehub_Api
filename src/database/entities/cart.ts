import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Dish } from './Dish';
import { Order } from './order_table';
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_Id' })
  user: User;


  @ManyToOne(() => Dish)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @Column()
  total_quantity: number;

  @Column({ nullable: true })
  total_price: number;

  @Column()
  delivery_date: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_on: Date;


  @ManyToOne(() => Order, order => order.carts)
  @JoinColumn({ name: 'id' })
  order: Order;
  
}
