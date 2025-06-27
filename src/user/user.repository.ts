import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Like } from 'src/entity/like.entity';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {
    super(User, dataSource.createEntityManager());
  }
  async findAll(): Promise<User[]> {
    return this.find({
      relations: ['comments'],
    });
  }

  async findAllWithPagination(
    limit?: number,
    skip?: number,
    search?: string,
  ): Promise<User[]> {
    return this.find({
      order: { id: 'ASC' },
      where: { name: search },
      take: limit,
      skip: skip,
      relations: ['comments'],
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = this.findOne({ where: { id }, relations: ['comments'] });
    console.log(user);
    return user;
  }

  async upsertUser(id: number, user: Partial<User>): Promise<User> {
    const existingUser = await this.findById(id);
    if (existingUser) {
      await this.update(id, user);
      return existingUser;
    }
    const newUser = this.create(user);
    return this.save(newUser);
  }

  async removeById(id: number): Promise<void> {
    const user = await this.findOne({
      where: { id },
      relations: ['likes', 'comments', 'posts'],
    });
    if (!user) throw new NotFoundException('user not found!');

    const relationArr = ['likes', 'comments', 'posts'];
    relationArr.forEach((relations) => {
      user[relations].map((item) => this.deleteFromEntity(item.id, relations));
    });

    await this.softDelete({ id });
  }

  async deleteFromEntity(relationId: number, relation: string) {
    switch (relation) {
      case 'likes':
        await this.likeRepo.softDelete({ id: relationId });
        break;
      case 'comments':
        await this.commentRepo.softDelete({ id: relationId });
        break;
      case 'posts':
        await this.postRepo.softDelete({ id: relationId });
        break;
      default:
        throw new Error(`Unknown relation: ${relation}`);
    }
  }
}
