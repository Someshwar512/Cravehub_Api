// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// import { User } from "./User";
// import {Status} from "../../constant";

// @Entity({ name: "device_token" })
// export class DeviceToken {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: "token", nullable:false })
//   token: string;

//   @Column({ name: "status", default: Status.ACTIVE })
//   status: string;

//   @ManyToOne(() => User, { onDelete: "CASCADE",onUpdate:"CASCADE" })
//   @JoinColumn({ name: "user_id" })
//   user_id: number;

//   @Column({ name: "device_type" })
//   deviceType: string;

//   @CreateDateColumn({ name: "created_at" })
//   createdAt: Date;
// }
