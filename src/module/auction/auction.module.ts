import { Module } from '@nestjs/common';
import { AuctionController } from './controllers/auction.controller';
import { AuctionService } from './services/auction.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { AuctionRepository } from './repositories/auction.repository';
import { APP_FILTER } from '@nestjs/core';
import { CustomErrorFilter } from 'src/filter/customError.filter';
import { CustomEventFilter } from 'src/filter/customEvent.filter';
import { UserModule } from '../user/user.module';
import { AuctionBusinessLogic } from './businesslogics/auction.businesslogic';
@Module({
  imports: [RepositoryModule, UserModule],
  controllers: [AuctionController],
  providers: [
    AuctionService,
    AuctionRepository,
    AuctionBusinessLogic,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomEventFilter,
    },
  ],
  exports: [AuctionService],
})
export class AuctionModule {}
