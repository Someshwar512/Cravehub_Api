import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Offer } from "./Offer";

@Entity({ name: "offer_type" })
export class OfferType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 35 })
    name: string;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" })
    updated_on: Date;

    @OneToMany(() => Offer, (offer) => offer.offerType)
    offers: Offer[];

    
}
