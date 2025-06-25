import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './entity/user.entity';
import { Comment } from './entity/comment.entity';
import { CommentModule } from './comment/comment.module';
import { Post } from './entity/post.entity';
import { Like } from './entity/like.entity';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'zenmonk',
      database: 'postgres',
      synchronize: true,
      entities: [User, Comment, Post, Like],
      subscribers: [],
      migrations: [],
    }),
    UserModule,
    CommentModule,
    LikeModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
