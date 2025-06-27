import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Like, Repository, DataSource } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  async addPostToUser(userId: number, post: Partial<Post>) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found!');
    const postCreated = this.postRepo.create({ ...post, user });
    return this.postRepo.save(postCreated);
  }

  async createPostWithAutoLike(
    userId: number,
    postData: {
      content: string;
      mediaType: string;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(User, { id: userId });
      if (!user) {
        throw new Error('User not found');
      }
      const post = await queryRunner.manager.save(
        queryRunner.manager.create(Post, {
          ...postData,
          user: user,
        }),
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(Like, {
          user: user,
          post: post,
        }),
      );

      await queryRunner.commitTransaction();
      return post;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
