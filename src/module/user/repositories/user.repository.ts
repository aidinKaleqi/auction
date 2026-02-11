import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CustomError } from 'src/filter/custom.error';
import { DatabaseRepository } from 'src/repository/database.repository';
import { UserEntity } from 'src/repository/entities/user/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserRepository extends DatabaseRepository {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager);
  }

  async findUserAndLock(
    userId: number,
    manager: EntityManager,
  ): Promise<UserEntity> {
    try {
      const user = await manager
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .setLock('pessimistic_write')
        .where('user.id = :id', { id: userId })
        .getOne();
      return user;
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async saveUser(user: UserEntity, manager: EntityManager): Promise<void> {
    try {
      await manager.save(UserEntity, user);
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }
}
