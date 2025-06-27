import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Like } from 'src/entity/like.entity';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { UserCleanupService } from './user-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post, Like])],
  providers: [UserCleanupService],
})
export class UserCleanupModule {}
