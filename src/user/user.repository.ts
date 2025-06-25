import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
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
    return this.findOne({ where: { id }, relations: ['comments'] });
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
    await this.delete({ id });
  }
}
