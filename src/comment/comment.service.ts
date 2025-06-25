import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';
import { Post } from 'src/entity/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async addCommentToUser(
    userId: number,
    comment: Partial<Comment>,
    postId: number,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    // comment.comment = commentText;
    // comment.user = user;

    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found!');

    const commentSaved = this.commentRepo.create({ ...comment, user, post });
    return this.commentRepo.save(commentSaved);
  }
}
