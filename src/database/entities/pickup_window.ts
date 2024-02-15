import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChefMenu } from './chef_menu';
import { Order } from './order_table';

@Entity({ name: 'pickup_window' }) 
export class PickupWindow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 25 })
    window: string;

    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_on: Date;
  
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_on: Date;


    @OneToMany(() => Order, (order) => order.pickupWindow)
    orders: Order[];


    @OneToMany(() => ChefMenu, chefMenu => chefMenu.pickupWindow)
    chefMenus: ChefMenu[];
}
