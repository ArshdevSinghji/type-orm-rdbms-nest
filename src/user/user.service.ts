import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  findAll(limit?: number, skip?: number, search?: string) {
    if (limit || skip || search) {
      return this.userRepo.findAllWithPagination(limit, skip, search);
    }
    return this.userRepo.find({
      order: { id: 'ASC' },
      relations: ['comments', 'posts', 'likes'],
    });
  }

  findOne(id: number) {
    const user = this.userRepo.findOne({
      where: { id },
      relations: [
        'comments',
        'posts',
        'likes',
        'posts.comments',
        'posts.likes',
      ],
    });
    return user;
  }

  upsert(id: number, user: Partial<User>) {
    return this.userRepo.upsertUser(id, user);
  }

  async create(user: Partial<User>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let savedUser;

      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: user.email },
        withDeleted: true,
      });

      if (existingUser && existingUser.deletedAt) {
        const currentDate = new Date();
        const daysSinceDeleted = Math.floor(
          (currentDate.getTime() - existingUser.deletedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (daysSinceDeleted <= 30) {
          existingUser.deletedAt = null;
          Object.assign(existingUser, user);
          savedUser = await queryRunner.manager.save(existingUser);
        } else {
          await queryRunner.manager.delete(User, { id: existingUser.id });
          savedUser = queryRunner.manager.create(User, user);
          await queryRunner.manager.save(savedUser);
        }
      } else if (existingUser) {
        throw new NotFoundException('User already exsists!');
      } else {
        savedUser = queryRunner.manager.create(User, user);
        await queryRunner.manager.save(savedUser);
      }
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  delete(id: number) {
    return this.userRepo.removeById(id);
  }
}
