import { Injectable } from '@nestjs/common';
import { AuctionService } from '../services/auction.service';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { CustomEvent } from 'src/filter/custom.event';
import { UserService } from 'src/module/user/services/user.service';
import { BidEntity } from 'src/repository/entities/auction/bid.entity';

@Injectable()
export class AuctionBusinessLogic {
  constructor(
    private readonly auctionService: AuctionService,
    private readonly userService: UserService,
  ) {}

  async createAuction(createAuction: CreateAuctionDto): Promise<void> {
    await this.auctionService.createAuction(createAuction);
  }

  async getActiveAuctions(
    page: number = 1,
    limit: number = 10,
  ): Promise<AuctionEntity[]> {
    return await this.auctionService.getActiveAuctions(page, limit);
  }

  async closeAuction(id: number): Promise<void> {
    await this.getAuctionById(id);
    await this.auctionService.closeAuction(id);
  }

  async getAuctionWinner(id: number): Promise<AuctionEntity['winner']> {
    const { body, exists } = await this.auctionService.getAuctionWinner(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    if (body.status !== 'closed') {
      throw new CustomEvent('Auction Not Closed', 400);
    }
    return body.winner;
  }

  async placeBid(
    userId: number,
    auctionId: number,
    amount: string,
  ): Promise<void> {
    const auctionBody = await this.getAuctionById(auctionId);
    if (auctionBody.status !== 'active') {
      throw new CustomEvent('Auction Not Active', 400);
    }
    if (auctionBody.endsAt <= new Date()) {
      throw new CustomEvent('Auction has ended', 400);
    }
    if (!this.auctionService.validateBidAmount(auctionBody, amount)) {
      throw new CustomEvent('Bid must be higher than current highest bid', 400);
    }
    const hasSufficientBalance =
      await this.userService.ensureUserHasSufficientBalance(Number(amount));
    if (!hasSufficientBalance) {
      throw new CustomEvent('Insufficient balance', 400);
    }
    await this.auctionService.placeBid(userId, auctionBody, amount);
  }

  async getAuctionById(id: number): Promise<AuctionEntity> {
    const { body, exists } = await this.auctionService.getAuctionById(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    return body;
  }

  async getBidsForAuction(auctionId: number): Promise<BidEntity[]> {
    await this.getAuctionById(auctionId);
    return await this.auctionService.getBidsForAuction(auctionId);
  }
}
