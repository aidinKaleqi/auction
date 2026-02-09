import { Module } from '@nestjs/common';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { CustomErrorFilter } from 'src/filter/customError.filter';
import { CacheRepository } from './cache.repository';
import { DatabaseRepository } from './database.repository';
@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfig)],
  controllers: [],
  providers: [
    DatabaseRepository,
    CacheRepository,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
  exports: [CacheRepository, DatabaseRepository],
})
export class RepositoryModule {}
