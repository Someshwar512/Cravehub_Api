import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Dish } from "./Dish";
import { DatabaseTables } from "../../constant";


@Entity({ name: DatabaseTables.FAVOURITES })
export class Favourite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_on: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updated_on: Date;

    @ManyToOne(() => User, user => user.favourites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Dish, dish => dish.favourites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "dish_id" })
    dish: Dish;
}
