import { DataSource, DataSourceOptions, Like } from 'typeorm';
import { User } from './entity/user.entity';
import { Comment } from './entity/comment.entity';
import { Post } from '@nestjs/common';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'zenmonk',
  database: 'user_media',
  synchronize: true,
  entities: [User, Comment, Post, Like],
  subscribers: [],
  migrations: [],
});
