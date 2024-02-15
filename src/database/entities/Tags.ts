
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { ChefTag } from "./Chef_Tags";
import { User } from "./User";
@Entity({ name: "tags" })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 35, nullable: false })
    tag_type: string;


    @OneToMany(() => ChefTag, (chefTag) => chefTag.tag)
    chefTags: ChefTag[];

    @ManyToMany(() => User, user => user.tag)
    chefs: User[];
}
