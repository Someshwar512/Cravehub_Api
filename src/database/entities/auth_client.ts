import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status, DeviceType, Deleted_Status } from '../../constant'; // Import necessary enums from constant file

@Entity({ name: 'auth_client' })
export class AuthClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  app_id: string;

  @Column({ type: 'varchar', length: 40 })
  app_secret: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    nullable: true, 
  })
  platform: DeviceType;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Deleted_Status,
    default: Deleted_Status.NOT_DELETED,
  })
  is_deleted: Deleted_Status;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;
}
