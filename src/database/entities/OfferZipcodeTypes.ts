import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Status } from "../../constant";
import { Offer } from "./Offer";

@Entity({ name: "offer_zipcode_types" })
export class OfferZipcodeTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 35 })
    name: string;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" })
    updated_on: Date;

    @OneToMany(() => Offer, (offer) => offer.offerZipcodeTypes)
    offers: Offer[];
}
