
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne,JoinColumn ,OneToMany} from 'typeorm';
import { Tag } from './Tags';
import { User } from './User';
// import { User } from './User';
// import { Tag } from './Tags';
@Entity()
 export class ChefTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag_id: number;

  @Column()
  chef_id: number;



  @ManyToOne(() => User, (user) => user.chefTags)
  @JoinColumn({name:'chef_id'})
  chef:User;

  @ManyToOne(() => Tag, (tag) => tag.chefs)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
 
}