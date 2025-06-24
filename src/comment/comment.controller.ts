import { Body, Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('users/:userId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('comment') commentText: string,
  ) {
    return this.commentService.addCommentToUser(userId, commentText);
  }
}
