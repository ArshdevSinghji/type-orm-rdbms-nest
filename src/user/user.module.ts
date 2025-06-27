import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.contoller';
import { UserRepository } from './user.repository';
import { Like } from 'src/entity/like.entity';
import { Post } from 'src/entity/post.entity';
import { Comment } from 'src/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Post, Comment])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
