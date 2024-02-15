import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DatabaseTables,Status ,Deleted_Status} from '../../constant';

@Entity({ name: DatabaseTables.EMAIL_TEMPLATE })
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;

  @Column({ type: 'enum', enum: Deleted_Status, default: Deleted_Status.NOT_DELETED })
  is_deleted: Deleted_Status;
}
