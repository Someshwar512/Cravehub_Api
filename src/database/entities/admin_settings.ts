import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AdminSettings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    fb_link: string;

    @Column({ nullable: true })
    instagram_link: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    delivery_charges: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    tax: number;
}
