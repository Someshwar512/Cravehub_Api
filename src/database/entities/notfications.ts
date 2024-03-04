import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User"; // Assuming you have a User entity

@Entity({ name: "notifications" })
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    user_id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: "user_id" })
    user: User;

}
