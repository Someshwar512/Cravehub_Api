import { Entity, PrimaryGeneratedColumn, Column ,ManyToMany,JoinTable} from 'typeorm';
import { Dish } from './Dish';
@Entity()
export class Dietary {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ length: 35 })
  type: string;

  @ManyToMany(type => Dish,dish => dish.dietries)
  @JoinTable()
  dishes: Dish[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
