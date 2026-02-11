
import { Injectable } from '@nestjs/common';
import { AuctionService } from '../services/auction.service';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
@Injectable()
export class AuctionBusinessLogic {
    constructor(private readonly auctionService: AuctionService){}

    async createAuction(createAuction: CreateAuctionDto): Promise<void>{
        await this.auctionService.createAuction(createAuction);
    }
}