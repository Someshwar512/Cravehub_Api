import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Zipcode } from "./Zipcode";
import { Offer } from "./Offer";

@Entity({ name: "zipcode_offers" })
export class ZipcodeOffers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Zipcode)
    @JoinColumn({ name: "zipcode_id" })
    zipcode: Zipcode; // Make sure this property is assigned

    @ManyToOne(() => Offer)
    @JoinColumn({ name: "offer_id" })
    offer: Offer;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;   

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" })
    updated_on: Date;

    @ManyToMany(() => Offer, { cascade: true })
    @JoinTable({
        name: 'zipcode_offers',
        joinColumn: { name: 'zipcode_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'offer_id', referencedColumnName: 'id' },
    })
    offers: Offer[];
}
