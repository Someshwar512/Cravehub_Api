import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Banner } from './Banner';
import { Zipcode } from './Zipcode';

@Entity()
export class Banner_Zipcode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  banner_id: number;

  @Column()
  zipcode_id: number;

  @ManyToOne(() => Banner)
  @JoinColumn({ name: 'banner_id' })
  banner: Banner;

  @ManyToOne(() => Zipcode)
  @JoinColumn({ name: 'zipcode_id' })
  zipcode: Zipcode;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updated_on: Date;


}
