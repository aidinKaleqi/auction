import { UserEntity } from 'src/repository/entities/user/user.entity';
import { UserService } from '../services/user.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CustomEvent } from 'src/filter/custom.event';

@Injectable()
export class UserBusinessLogic {
  constructor(private readonly userService: UserService) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.userService.checkUsernameAndEmailExists(
      user.username,
      user.email,
    );
    if (userExists) {
      throw new CustomEvent('User Or Email already exists', 400);
    }
    return this.userService.createUser(user);
  }

  async ensureUserHasSufficientBalance(amount: number): Promise<boolean> {
    return await this.userService.ensureUserHasSufficientBalance(amount);
  }

  async deductBalance(userId: number, amount: number): Promise<void>{
    return await this.userService.deductBalance(userId, amount);
  }
}
