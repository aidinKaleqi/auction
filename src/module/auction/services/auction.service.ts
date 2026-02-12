import { Injectable } from '@nestjs/common';
import { AuctionRepository } from '../repositories/auction.repository';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { AuctionStatus } from '../enums/auction.enum';
import { BidEntity } from 'src/repository/entities/auction/bid.entity';
import { BidStatus } from '../enums/bid.enum';
import { DataSource } from 'typeorm/data-source/DataSource';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull/dist/decorators/inject-queue.decorator';

@Injectable()
export class AuctionService {
  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly dataSource: DataSource,
    @InjectQueue('auction-lifecycle')
    private readonly auctionQueue: Queue,
  ) {}

  async createAuction(
    data: Partial<AuctionEntity>,
  ): Promise<AuctionEntity> {
    const auction = await this.auctionRepository.createAuction(data, 1);
    return auction;
  }
  async scheduleAuctionJobs(id: number, startsAt: number, endsAt: number) {
    const now = Date.now();
    const startDelay = startsAt - now;
    const closeDelay = endsAt - now;

    if (startDelay > 0) {
      await this.auctionQueue.add(
        'start-auction',
        { auctionId: id },
        { delay: startDelay },
      );
    }

    if (closeDelay > 0) {
      await this.auctionQueue.add(
        'close-auction',
        { auctionId: id },
        { delay: closeDelay },
      );
    }
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

  async closeAuction(id: number): Promise<BidEntity> {
    const highestBid = await this.determineWinner(id);
    return highestBid;
  }

  async startAuction(id: number): Promise<void> {
    await this.auctionRepository.update(
      AuctionEntity,
      { id },
      { status: AuctionStatus.ACTIVE },
    );
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

  private async determineWinner(id: number): Promise<BidEntity> {
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
    return highestBid;
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
