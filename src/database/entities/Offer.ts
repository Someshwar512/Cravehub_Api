import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable,ManyToOne, JoinColumn, OneToOne ,ManyToMany, OneToMany} from "typeorm";
import { DatabaseTables, AutoApplied, DiscountType, Deleted_Status, Status } from "../../constant";
import { Banner } from "./Banner";
import { OfferZipcodeTypes } from "./OfferZipcodeTypes";
import { OfferType } from "./OfferType";
import { OfferChannel } from "./OfferChannel";
import { ZipcodeOffers } from "./ZipcodeOffers";
import { Zipcode } from "./Zipcode";
import { Order } from "./order_table";

@Entity({ name: DatabaseTables.OFFER })
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    code: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "enum", enum: Object.values(DiscountType) })
    discount_type: DiscountType;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    discount: number;

    @Column({ type: "datetime" })
    start_date: Date;

    @Column({ type: "datetime" })
    end_date: Date;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    max_amount: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    min_amount: number;

    @Column({ type: "enum", enum: Object.values(Status), default: Status.ACTIVE })
    status: Status;

    @Column({ type: "enum", enum: Object.values(Deleted_Status),default: Deleted_Status.NOT_DELETED })
    is_deleted: Deleted_Status;



    @Column({ type: "int" })
    usage_limit: number;

    @Column({ type: "text" })
    discount_reason: string;

    @ManyToOne(() => OfferZipcodeTypes)
    @JoinColumn({ name: "offer_zipcode_types_id" }) // done
    offerZipcodeTypes: OfferZipcodeTypes;

    @ManyToOne(() => OfferType)
    @JoinColumn({ name: "offer_type_id" })// done
    offerType: OfferType;

    @ManyToOne(() => OfferChannel)
    @JoinColumn({ name: "offer_channel_id" })// done
    offerChannel: OfferChannel;

    @Column({ type: "enum", enum: Object.values(AutoApplied), default: AutoApplied.FALSE })
    auto_applied: AutoApplied;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;
    
    @Column({ type: "varchar" })
    name: string;

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" })
    updated_on: Date;

    // @OneToMany(() => ZipcodeOffers, (zipcodeOffer) => zipcodeOffer.offer)
    // zipcodeOffers: ZipcodeOffers[];
    
    @ManyToMany(() => Zipcode, { cascade: true })
    @JoinTable({
        name: 'zipcode_offers', // Make sure this matches the actual name of your join table in the database
        joinColumn: { name: 'offer_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'zipcode_id', referencedColumnName: 'id' },
    })
    zipcodes: Zipcode[];

    @OneToMany(() => Order, order => order.offerCode)
    orders: Order[];
    
    


}
