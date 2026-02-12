import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { DataSource } from 'typeorm/data-source/DataSource';
import { UserEntity } from 'src/repository/entities/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async ensureUserHasSufficientBalance(amount: number): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findUserAndLock(1, manager);
      const availableBalance =
        Number(user.balance) - Number(user.reservedBalance || 0);

      if (availableBalance < amount) {
        return false;
      }
      user.reservedBalance = String(Number(user.reservedBalance || 0) + amount);
      await this.userRepository.saveUser(user, manager);
      return true;
    });
  }

  async deductBalance(userId: number, amount: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findUserAndLock(userId, manager);
      user.balance = String(Number(user.balance) - amount);
      user.reservedBalance = String(Number(user.reservedBalance || 0) - amount);
      await this.userRepository.saveUser(user, manager);
    });
  }

  async checkUsernameAndEmailExists(
    username: string,
    email: string,
  ): Promise<boolean> {
    const exists = await this.userRepository.exists(UserEntity, {
      where: [{ username }, { email }],
    });
    return exists;
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const { body } = await this.userRepository.insert(UserEntity, data);
    return body;
  }
}
