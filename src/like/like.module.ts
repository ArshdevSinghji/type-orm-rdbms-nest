import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Like } from 'src/entity/like.entity';
import { User } from 'src/entity/user.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Module } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Like, Post])],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
