import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from "typeorm";
import { Dish } from "./Dish";
import { ChefCuisine } from "./Chef_Cuisine";

@Entity({ name: "cuisine" })
export class Cuisine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 35, nullable: false })
    name: string;

    @OneToMany(() => Dish, (dish) => dish.cuisine)
    dishes: Dish[];

    @OneToMany(() => ChefCuisine, (chefCuisine) => chefCuisine.cuisine)
    chefCuisines: ChefCuisine[];
}
