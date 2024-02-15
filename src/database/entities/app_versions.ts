import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status, DeviceType, UpdateType, Deleted_Status } from '../../constant';  

@Entity({ name: 'app_versions' })
export class AppVersions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  version_number: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE})
  status: Status;

  @Column({ type: 'enum', enum: DeviceType, nullable: true, })
  platform: DeviceType;

  @Column({ type: 'enum', enum: UpdateType,})
  update_type: UpdateType;

  @Column({type: 'enum', enum: Deleted_Status, default: Deleted_Status.NOT_DELETED,
  })
  is_deleted: Deleted_Status;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;
}
