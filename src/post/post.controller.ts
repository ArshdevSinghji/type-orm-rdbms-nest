import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from 'src/entity/post.entity';

@Controller('users/:userId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch()
  async addPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() post: Partial<Post>,
  ) {
    return this.postService.addPostToUser(userId, post);
  }
}
