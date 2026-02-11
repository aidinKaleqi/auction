import { Module } from '@nestjs/common';
import { AuctionModule } from './module/auction/auction.module';
import { RouterModule } from '@nestjs/core';
import { Routes } from './router';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
@Module({
  imports: [
    AuctionModule,
    UserModule,
    RouterModule.register(Routes),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
