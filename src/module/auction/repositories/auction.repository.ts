import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DatabaseRepository } from 'src/repository/database.repository';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { EntityManager } from 'typeorm';
import { AuctionStatus } from '../enums/auction.enum';
import { CustomError } from 'src/filter/custom.error';
import { BidEntity } from 'src/repository/entities/auction/bid.entity';
import { CreateAuctionDto } from '../dtos/create-auction.dto';

@Injectable()
export class AuctionRepository extends DatabaseRepository {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager);
  }
  async createAuction(
    createAuctionDto: CreateAuctionDto,
    userId: number,
  ): Promise<AuctionEntity> {
    try {
      const auction = this.entityManager.create(AuctionEntity, {
        ...createAuctionDto,
        status: AuctionStatus.PENDING,
        createdBy: { id: userId },
      });

      return this.entityManager.save(AuctionEntity, auction);
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async getHighestBidder(auctionId: number) {
    const highestBid = await this.entityManager
      .getRepository(BidEntity)
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.bidder', 'user')
      .where('bid.auction = :auctionId', { auctionId })
      .andWhere('bid.status = :status', { status: 'accepted' })
      .orderBy('bid.amount', 'DESC')
      .addOrderBy('bid.createdAt', 'ASC')
      .getOne();
    return highestBid;
  }
}
