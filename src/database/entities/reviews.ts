// reviews.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,OneToMany } from 'typeorm';
import { Order } from './order_table';
import { Reviews_Type } from '../../constant'; 
import { User } from './User';
import { Dish } from './Dish';
import { ChefMenu } from './chef_menu';
import { OrderItems } from './order_items';

@Entity({ name: 'reviews' })
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  chef_id: number;

  @Column({ type: 'int' })
  order_id: number;

  @Column({ type: 'double' })
  rating: number;


  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: Reviews_Type })
  type: Reviews_Type;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' })
  updated_on: Date;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'chef_id' })
  user: User;

  @ManyToOne(() => Order, order => order.review)
  @JoinColumn({ name: 'order_id' })
  order: Order;


  // @ManyToOne(type => Dish, dish => dish.reviews)
  // @JoinColumn
  // dish: Dish;

  @ManyToOne(() => Dish, dish => dish.reviews)
  @JoinColumn({ name: 'dish_id' }) 
  dish: Dish;


  // @ManyToOne(() => ChefMenu, (chefMenu) => chefMenu.reviews)
  // chefMenu: ChefMenu;

  @OneToMany(() => OrderItems, orderItems => orderItems.order)
  orderItems: OrderItems[];

  
}







