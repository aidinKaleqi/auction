import { Injectable } from '@nestjs/common';
import { AuctionRepository } from '../repositories/auction.repository';

@Injectable()
export class AuctionService {
  constructor(private readonly auctionRepository: AuctionRepository) {}
}
