import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addCommentToUser(userId: number, commentText: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    // comment.comment = commentText;
    // comment.user = user;
    const comment = this.commentRepo.create({ comment: commentText, user });
    return this.commentRepo.save(comment);
  }
}
