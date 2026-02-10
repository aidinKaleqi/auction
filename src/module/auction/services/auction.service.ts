import { Injectable } from '@nestjs/common';
import { AuctionRepository } from '../repositories/auction.repository';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { AuctionStatus } from '../enums/auction.enum';

@Injectable()
export class AuctionService {
  constructor(private readonly auctionRepository: AuctionRepository) {}

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
    await this.auctionRepository.update(
      AuctionEntity,
      { id },
      { status: AuctionStatus.CLOSED },
    );
  }
}
