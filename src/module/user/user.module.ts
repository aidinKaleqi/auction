import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { UserRepository } from './repositories/user.repository';
import { APP_FILTER } from '@nestjs/core';
import { CustomErrorFilter } from 'src/filter/customError.filter';
import { CustomEventFilter } from 'src/filter/customEvent.filter';
@Module({
  imports: [RepositoryModule],
  providers: [
    UserService,
    UserRepository,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomEventFilter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
