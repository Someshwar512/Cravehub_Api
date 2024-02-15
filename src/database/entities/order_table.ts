// order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany } from 'typeorm';
import { User } from './User';
import { Offer } from './Offer';
import { PickupWindow } from './pickup_window';
import { Reviews } from './reviews';
import { OrderItems } from './order_items';
import { ChefMenu } from './chef_menu';
import { UserAddress } from './User_address';
import { OrderStatus,DeliveryPreference } from '../../constant';
import { Cart } from './cart';
import { Dish } from './Dish';
@Entity({ name: 'order_table' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  subtotal: number;

  @Column({ type: 'decimal' })
  total_amount: number;

  @Column({ type: 'decimal' })
  discount_amount: number;


  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.INPROGRESS })
  order_status: OrderStatus;

  @Column({ type: 'decimal' })
  tax_amount: number;

  @Column({ type: 'decimal' })
  delivery_fees: number;


  @Column({ type: 'text', nullable: true })
  order_instruction: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

  @Column({ type: 'datetime'})
  order_scheduled_date: Date;


  @Column({ type: 'enum', enum: DeliveryPreference, default: DeliveryPreference.DELIVERY })
delivery_preference: DeliveryPreference;

@Column({ type: 'varchar', nullable: true })
cancelled_by: string;


@Column({ type: 'varchar', nullable: true })
payment_status: string;


@Column({ type: 'varchar', nullable: true })
reason_of_cancellation: string;

@Column({ type: 'int', nullable: true })
chef_id: number;

@Column({ type: 'int', nullable: true })
user_address_id: number;

@ManyToOne(() => User, (user) => user.orders)
@JoinColumn({ name: 'chef_id' })
chef: User;

// @ManyToOne(() => UserAddress, (userAddress) => userAddress.orders)
// @JoinColumn({ name: 'user_address_id' })
// userAddress: UserAddress;

  
  @ManyToOne(() => PickupWindow, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pickupwindow_id' })
  pickupWindow: PickupWindow;


  @ManyToOne(() => Offer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'offer_code_id' })
  offerCode: Offer;


  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reviews, (review) => review.order)
  review: Reviews[];

  @OneToMany(() => OrderItems, orderItems => orderItems.order)
  orderItems: OrderItems[];

  @OneToMany(() => Cart, cart => cart.order)
  carts: Cart[];


  // @OneToMany(() => Dish, dish => dish.order)
  // dishes: Dish[]; 

  
}
