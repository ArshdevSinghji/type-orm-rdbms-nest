import { Post } from './post.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;

  @ManyToOne(() => User, (post) => post.likes)
  user: User;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
