import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entity/user.entity';
import { Comment } from './entity/comment.entity';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const type = configService.get<
  'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'oracle' | 'mongodb'
>('DATABASE_TYPE', 'mysql');
const host = configService.get<string>('DATABASE_HOST');
const port = parseInt(configService.get<string>('DATABASE_PORT', '3306'), 10);
const username = configService.get<string>('DATABASE_USERNAME');
const password = configService.get<string>('DATABASE_PASSWORD');
const database = configService.get<string>('DATABASE_NAME');

if (!type || !host || !username || !password || !database) {
  throw new Error('Database configuration is incomplete');
}

export const AppDataSource = new DataSource({
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize: true,
  logging: true,
  entities: [User, Comment],
  subscribers: [],
  migrations: [],
} as DataSourceOptions);
