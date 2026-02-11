import { Injectable } from '@nestjs/common';
import { AuctionRepository } from '../repositories/auction.repository';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { AuctionStatus } from '../enums/auction.enum';
import { BidEntity } from 'src/repository/entities/auction/bid.entity';
import { BidStatus } from '../enums/bid.enum';
import { DataSource } from 'typeorm/data-source/DataSource';

@Injectable()
export class AuctionService {
  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
  ): Promise<AuctionEntity> {
    return this.auctionRepository.createAuction(createAuctionDto, 1);
  }

  async getAuctionById(
    id: number,
  ): Promise<{ body: AuctionEntity; exists: boolean }> {
    const result = await this.auctionRepository.findOne(AuctionEntity, {
      where: { id },
    });
    return result;
  }

  async getActiveAuctions(
    page: number,
    limit: number,
  ): Promise<AuctionEntity[]> {
    const { body, exists } = await this.auctionRepository.findAll(
      AuctionEntity,
      {
        where: { status: AuctionStatus.ACTIVE },
        skip: (page - 1) * limit,
        take: limit,
      },
    );
    return body;
  }

  async closeAuction(id: number): Promise<void> {
    await this.determineWinner(id);
  }

  async getAuctionWinner(
    id: number,
  ): Promise<{ body: AuctionEntity; exists: boolean }> {
    const result = await this.auctionRepository.findOne(AuctionEntity, {
      where: { id },
      relations: ['winner'],
    });
    return result;
  }

  async getBidsForAuction(auctionId: number): Promise<BidEntity[]> {
    const result = await this.auctionRepository.findAll(BidEntity, {
      where: { auction: { id: auctionId } },
      relations: ['bidder'],
    });
    return result.body;
  }

  private async determineWinner(id: number): Promise<void> {
    const highestBid = await this.auctionRepository.getHighestBidder(id);
    if (highestBid) {
      await this.auctionRepository.update(
        AuctionEntity,
        { id },
        {
          winner: { id: highestBid.bidder.id },
          status: AuctionStatus.CLOSED,
          closedAt: new Date(),
        },
      );
    }
  }

  validateBidAmount(auction: AuctionEntity, amount: string): boolean {
    const currentPrice = Number(
      auction.currentHighestBid ?? auction.startingPrice,
    );
    return Number(amount) > currentPrice;
  }

  async placeBid(
    userId: number,
    auction: AuctionEntity,
    amount: string,
    bidReason?: string,
  ): Promise<BidEntity> {
    const bid = await this.auctionRepository.insert(BidEntity, {
      auction: { id: auction.id },
      bidder: { id: userId },
      amount: amount,
      status: BidStatus.ACCEPTED,
      bidReason: bidReason,
    });
    auction.currentHighestBid = amount;
    await this.auctionRepository.save(AuctionEntity, auction);
    return bid.body;
  }
}
