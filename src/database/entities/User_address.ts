import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn ,OneToOne} from 'typeorm';
import { Zipcode } from '../entities/Zipcode';
import { User } from '../entities/User';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column({ type: 'float', default: 0 })
  latitude: number;

  @Column({ type: 'float', default: 0 })
  longitude: number;

  
  @ManyToOne(() => Zipcode)
  @JoinColumn({ name: 'zipcode_id' })
  zipcode: Zipcode;
 
  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user_id: User;

  // @OneToMany((type)=> UserAddress, (user) => user.user_id)
  // users:UserAddress[]


  // @ManyToOne((type)=> User,(user) => user.user_id)
  // user:User[]

  // @ManyToOne(() => User, user => user.address)
  // user: User;

  @ManyToOne((type) => User, user => user.address)
  @JoinColumn({ name: 'user_id' }) // Replace with your actual foreign key column name
  user: User;
 

  


}
