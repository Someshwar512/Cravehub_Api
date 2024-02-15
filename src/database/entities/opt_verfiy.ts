// OTPToken.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User'; // Import User entity
import { OtpUse } from '../../constant';
import { Status } from '../../constant';
@Entity()
export class OTP_VERFIY {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.otp)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column()
  otp: string;

  @Column({ type: 'enum', enum:OtpUse,default:OtpUse.NOT_USED })
  is_used: OtpUse;
 

  @Column()
  expired_on: Date;
  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;
}
