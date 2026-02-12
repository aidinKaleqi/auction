import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserBusinessLogic } from '../businesslogics/user.businesslogic';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateUserDto } from '../dtos/create-user.dto';
import { createUserInterface } from '../interfaces/user.interface';

@Controller('/')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userBusinesslogic: UserBusinessLogic) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<createUserInterface> {
    const user = await this.userBusinesslogic.createUser(body);
    return user;
  }
}
