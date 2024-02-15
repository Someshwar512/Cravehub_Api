import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { City } from '../entities/City';
import { Status } from '../../constant';
import { Deleted_Status } from '../../constant';
import { ZipcodeOffers } from './ZipcodeOffers';
import { Banner } from './Banner';

@Entity()
export class Zipcode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  zipcode: string;
  
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @ManyToOne(() => City, city => city.zipcodes)
  @JoinColumn({ name: 'city_Id' })
  city: City;

  @Column({ type: 'enum', enum: Deleted_Status, default: Deleted_Status.NOT_DELETED })
  is_deleted: Deleted_Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @OneToMany(() => ZipcodeOffers, (zipcodeOffer) => zipcodeOffer.zipcode)
  zipcodeOffers: ZipcodeOffers[];

  @ManyToMany(() => Banner, (banner) => banner.zipcodes)
@JoinTable({
    name: 'banner_zipcode', // Use the actual name of your join table
    joinColumn: { name: 'zipcode_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'banner_id', referencedColumnName: 'id' },
})
banners: Banner[];

}

