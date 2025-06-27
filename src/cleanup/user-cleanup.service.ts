import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { DataSource, LessThan, Like, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Comment } from 'src/entity/comment.entity';
import { Post } from 'src/entity/post.entity';

@Injectable()
export class UserCleanupService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  @Cron('0 10 * * * *') //every hour, at the start of the 10th minute
  async cleanUpExpiredAccount() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expiredUsers = await this.userRepo.find({
      where: { deletedAt: LessThan(thirtyDaysAgo) },
      withDeleted: true,
    });

    for (const user of expiredUsers) {
      try {
        await this.permanentDelete(user.id);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  private async permanentDelete(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(User, { id: id });
      await queryRunner.manager.delete(Like, { id: id });
      await queryRunner.manager.delete(Comment, { id: id });
      await queryRunner.manager.delete(Post, { id: id });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
