import { Module } from '@nestjs/common';
import { AuctionModule } from './module/auction/auction.module';
import { RouterModule } from '@nestjs/core';
import { Routes } from './router';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuctionModule,
    RouterModule.register(Routes),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
