import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

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
    return this.userRepo.findOne({
      where: { id },
      relations: [
        'comments',
        'posts',
        'likes',
        'posts.comments',
        'posts.likes',
      ],
    });
  }

  upsert(id: number, user: Partial<User>) {
    return this.userRepo.upsertUser(id, user);
  }

  create(user: Partial<User>) {
    const createdUser = this.userRepo.create(user);
    return this.userRepo.save(createdUser);
  }

  delete(id: number) {
    return this.userRepo.removeById(id);
  }
}
