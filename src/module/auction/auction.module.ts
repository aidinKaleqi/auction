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
import { BullModule } from '@nestjs/bull';
import { AuctionProcessor } from './processes/auction.process';

@Module({
  imports: [
    RepositoryModule,
    UserModule,
    BullModule.registerQueue({
      name: 'auction-lifecycle',
    }),
  ],
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
    AuctionProcessor
  ],
  exports: [AuctionBusinessLogic],
})
export class AuctionModule {}
