import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Kitchen } from "./Kitchen";

@Entity({ name: "kitchen_photos" })
export class KitchenPhotos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: true, length: 255 })
    image_url: string;

    @ManyToOne(() => Kitchen, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "kitchen_id" })
    kitchen: Kitchen;
}
