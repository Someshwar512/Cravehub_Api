import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne,OneToMany,ManyToMany} from 'typeorm';
import { Dish } from './Dish';

@Entity()
export class Ingredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  
  @ManyToMany(type => Dish, dish => dish.ingredients)
  dishes: Dish[];

}
