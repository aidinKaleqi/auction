import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { DataSource } from 'typeorm/data-source/DataSource';

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
}
