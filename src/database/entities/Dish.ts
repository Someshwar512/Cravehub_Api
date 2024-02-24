import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,JoinColumn,OneToMany,ManyToMany,JoinTable } from 'typeorm';
import { FoodType } from './Foodtype';
import { User } from './User';
import { Cuisine } from './Cuisine';
import { PortionSize } from './Portion_Size';
import { Ingredients } from './Ingredients';
import { Dietary } from './Dietary';
import { ChefMenu } from './chef_menu';
import { OrderItems } from './order_items';
import { Reviews } from './reviews';
import { Order } from './order_table';
import { Favourite } from './favourite';
import { Deleted_Status,Status } from '../../constant';
@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FoodType, (foodtype) => foodtype.dishes)
  @JoinColumn({ name: 'foodtype_id' })
  foodtype: FoodType;

  
  @ManyToOne(() => Cuisine, (cuisine) => cuisine.dishes)
  @JoinColumn({ name: 'cuisine_id' })
  cuisine: Cuisine;

  @ManyToOne(() => PortionSize, (portion_size) => portion_size.dishes)
  @JoinColumn({ name: 'portion_size_id' })
  portion_size: PortionSize;

  @ManyToOne(() => User, user => user.dishes)
  @JoinColumn({ name: 'chef_id' })
  chef: User;

  // @ManyToMany(type => Ingredients, { cascade: true }) 
  // @JoinTable({ name: 'dietary' }) 
  // ingredients: Ingredients[]; 

  @ManyToMany(type => Ingredients, { cascade: true })
  @JoinTable({
    name: 'dish_ingredients',
    joinColumn: { name: 'dish_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ingredients_id', referencedColumnName: 'id' },
  })
  ingredients: Ingredients[];


  @ManyToMany(type => Dietary, { cascade: true })
  @JoinTable({
    name: 'dish_dietary',
    joinColumn: { name: 'dish_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'dietary_id', referencedColumnName: 'id' }, 
})
  dietries: Dietary[];
  
  @Column({ type: 'varchar', length: 25 })
  name: string;

@Column({ type: 'int', nullable: true })
  chef_id: number;

 

  @Column({ type: 'text' })
  dish_description: string;

  @Column({ type: 'decimal' })
  dish_price: number;

  @Column({ type: 'decimal', nullable: true })
  chef_price: number;

  @Column({ type: 'decimal', nullable: true })
  wannaeat_price: number;

  @Column({ type: 'int' })
  preparation_time: number;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @Column({ type: 'enum', enum: Deleted_Status, default: Deleted_Status.NOT_DELETED })
  is_deleted: Deleted_Status;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @OneToMany(() => ChefMenu, chefMenu => chefMenu.dish)
  chefMenus: ChefMenu[];

  @OneToMany(() => Reviews, review => review.dish)
  reviews: Reviews[];

  @OneToMany(() => OrderItems, orderItem => orderItem.dish)
  orderItems: OrderItems[];
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

    // // Establishing a many-to-one relationship with the Order entity
    // @ManyToOne(() => Order, order => order.dishes)
    // order: Order; // The order to which this dish belongs


    @OneToMany(() => Favourite, favourite => favourite.dish)
    favourites: Favourite[];

}
