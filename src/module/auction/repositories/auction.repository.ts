import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DatabaseRepository } from 'src/repository/database.repository';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { EntityManager } from 'typeorm';
import { AuctionStatus } from '../enums/auction.enum';
import { CustomError } from 'src/filter/custom.error';

@Injectable()
export class AuctionRepository extends DatabaseRepository {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager);
  }
  async createAuction(
    createAuctionDto: any,
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
}
