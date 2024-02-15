import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn ,OneToMany} from 'typeorm';
import { Status } from '../../constant';
import { Dish } from './Dish';
// @Entity()
@Entity({ name: 'foodtype' })
export class FoodType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 35 })
  name: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

  @OneToMany(() => Dish, (dish) => dish.foodtype)
  dishes: Dish[];
}
