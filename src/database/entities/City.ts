import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne,JoinColumn ,OneToMany} from 'typeorm';
import { State } from '../entities/State';
import { Zipcode } from './Zipcode';
import { Status } from '../../constant';


@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  

 

  @OneToMany(() => Zipcode, zipcode => zipcode.city)
  zipcodes: Zipcode[];

 


  @ManyToOne(() => State, state => state.cities)
  @JoinColumn({ name: 'state_id' }) 
  state: State;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
