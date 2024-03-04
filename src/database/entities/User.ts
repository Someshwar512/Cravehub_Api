import { Entity, PrimaryGeneratedColumn, Column, OneToMany ,ManyToOne,OneToOne,JoinColumn, JoinTable, ManyToMany} from 'typeorm';
import { DatabaseTables, Roles, Status, UserVerfiy, Deleted_Status,Food_Type } from '../../constant';
import { UserAddress } from '../entities/User_address';
import { City } from '../entities/City';
import { Zipcode } from './Zipcode';
import { OtpUse } from '../../constant';
import { Kitchen } from './Kitchen';
import {  OTP_VERFIY } from './opt_verfiy';
import { Order } from './order_table';
import { Reviews } from './reviews';
import { ChefMenu } from './chef_menu';
import { Tag } from './Tags'
import { ChefCuisine } from './Chef_Cuisine';
import { ChefTag } from './Chef_Tags';
import { Dish } from './Dish';
import { Favourite } from './favourite';
import { Notification } from './notfications';
@Entity({ name: DatabaseTables.USERS })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'phone', unique: true, nullable: false })
  phone: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({ type: 'enum', enum: UserVerfiy, default: UserVerfiy.NOT_VERFIED })
  is_verified: UserVerfiy;

  @Column({ type: 'enum', enum: Deleted_Status, default: Deleted_Status.NOT_DELETED })
  is_deleted: Deleted_Status;

  @Column({ type: "enum", enum: Food_Type,})
  food_type: Food_Type;

  @Column({ name: 'created_on', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ name: 'updated_on', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_on: Date;
  

  @OneToMany((type) => UserAddress, (userAddress) => userAddress.user)
  address: UserAddress[];

  @OneToMany(() => OTP_VERFIY, (otp) => otp.user)
  otp: OTP_VERFIY[]; 

  @OneToMany(() => Kitchen, kitchen => kitchen.chef) // Define the relationship
    kitchens: Kitchen[];
 
    @OneToMany(() => ChefCuisine, (chefCuisine) => chefCuisine.chef)
    chefCuisines: ChefCuisine[];

    @OneToMany(() => ChefTag, (chefTag) => chefTag.chef)
  chefTags: ChefTag[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.chef)
  orderss: Order[];


   @OneToMany(() => ChefMenu, chefMenu => chefMenu.user)
   chefMenus: ChefMenu[];

   @OneToMany(() => Reviews, review => review.user)
   reviews: Reviews[];


 

   @ManyToMany(type => Tag, { cascade: true })
  @JoinTable({
    name: 'chef_tag',
    joinColumn: { name: 'chef_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tag: Tag[];

 
   getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }

  


  @OneToMany(() => Dish, dish => dish.chef)
  dishes: Dish[];


  @OneToMany(() => Favourite, favourite => favourite.user)
  favourites: Favourite[];

  @OneToMany(type => Notification, notification => notification.user)
  notifications: Notification[];
  
}
