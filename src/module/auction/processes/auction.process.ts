import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AuctionService } from '../services/auction.service';
import { AuctionBusinessLogic } from '../businesslogics/auction.businesslogic';

@Processor('auction-lifecycle')
export class AuctionProcessor {
  constructor(private readonly auctionBusinesslogic: AuctionBusinessLogic) {}

  @Process('close-auction')
  async handleCloseAuction(job: Job<{ auctionId: number }>) {
    await this.auctionBusinesslogic.closeAuction(job.data.auctionId);
    console.log(`Auction ${job.data.auctionId} closed`);
  }

  @Process('start-auction')
  async handleStart(job: Job<{ auctionId: number }>) {
    await this.auctionBusinesslogic.startAuction(job.data.auctionId);
    console.log(`Auction ${job.data.auctionId} started`);
  }
}
