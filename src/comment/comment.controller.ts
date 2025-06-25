import { Body, Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/entity/comment.entity';

@Controller('users/:userId/comment/:postId')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() comment: Partial<Comment>,
  ) {
    return this.commentService.addCommentToUser(userId, comment, postId);
  }
}
