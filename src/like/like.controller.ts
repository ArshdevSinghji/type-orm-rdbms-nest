import { Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('users/:userId/like/:postId')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Patch()
  async addLike(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likeService.addLikeToPost(userId, postId);
  }
}
