import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cuisine } from './Cuisine';
import { User } from './User';

@Entity()
export class ChefCuisine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cuisine_id: number;

  @Column()
  chef_id: number;

  @ManyToOne(() => Cuisine, (cuisine) => cuisine. chefCuisines)
  @JoinColumn({ name: 'cuisine_id' })
  cuisine: Cuisine;

  @ManyToOne(() => User, (user) => user.chefCuisines)
  @JoinColumn({ name: 'chef_id' })
  chef: User;

}
