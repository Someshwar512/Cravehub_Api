import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,JoinColumn } from 'typeorm';
import { Country } from '../entities/Country';
import { City } from '../entities/City';
import { Status } from '../../constant';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  // @ManyToOne(() => Country, country => country.states)
  // country: Country;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @OneToMany(() => City, city => city.state)
  cities: City[];


  @ManyToOne(() => Country, country => country.states)
  @JoinColumn({ name: 'country_id' }) // Adjust to the correct column name
  country: Country;
}
