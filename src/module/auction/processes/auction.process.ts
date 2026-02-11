import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AuctionService } from '../services/auction.service';

@Processor('auction-lifecycle')
export class AuctionProcessor {
  constructor(private readonly auctionService: AuctionService) {}

  @Process('close-auction')
  async handleCloseAuction(job: Job<{ auctionId: number }>) {
    console.log(`Auction ${job.data.auctionId} closed`);
    await this.auctionService.closeAuction(job.data.auctionId);
  }

  @Process('start-auction')
  async handleStart(job: Job<{ auctionId: number }>) {
    console.log(`Auction ${job.data.auctionId} started`);
    await this.auctionService.startAuction(job.data.auctionId);
  }
}
