// Assuming your entity file is named BannerEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn ,OneToOne,JoinColumn,JoinTable,ManyToMany} from "typeorm";
import { Deleted_Status, BannerType } from "../../constant";
import { Offer } from "./Offer";
import { Zipcode } from "./Zipcode";

@Entity()
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    image_url: string;

    @Column({ type: "varchar", length: 25 })
    name: string;

    @Column({type: "text"})
    description: string

    @Column({ type: "datetime" })
    start_date: Date;

    @Column({ type: "datetime" })
    end_date: Date;

    @Column({ type: "enum", enum: BannerType, default: BannerType.MARKETING })
    type: BannerType;

    @Column({ type: "enum", enum: Deleted_Status, default: Deleted_Status.NOT_DELETED })
    is_deleted: Deleted_Status;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_on: Date;

    @Column({ type: 'int', nullable: true })
    offer_id: number;

    @OneToOne(() => Offer)
    @JoinColumn({ name: 'offer_id' })
    offer: Offer;
   
    @ManyToMany(() => Zipcode, { cascade: true })
    @JoinTable({
        name: 'banner_zipcode', // Use the actual name of your join table
        joinColumn: { name: 'banner_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'zipcode_id', referencedColumnName: 'id' },
    })
    zipcodes: Zipcode[];
    

}
