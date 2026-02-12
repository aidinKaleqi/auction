import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { UserRepository } from './repositories/user.repository';
import { APP_FILTER } from '@nestjs/core';
import { CustomErrorFilter } from 'src/filter/customError.filter';
import { CustomEventFilter } from 'src/filter/customEvent.filter';
import { UserController } from './controllers/user.controller';
import { UserBusinessLogic } from './businesslogics/user.businesslogic';
@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserBusinessLogic,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomEventFilter,
    },
  ],
  exports: [UserBusinessLogic],
})
export class UserModule {}
