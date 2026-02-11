import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { GetActiveAuctionsDto } from '../dtos/get-active-auctions.dto';
import { PlaceBidDto } from '../dtos/place-bid.dto';
import {
  CreateAuctionInterface,
  GetAuctionInterface,
  GetActiveAuctionsInterface,
  CloseAuctionInterface,
  DetermineWinnerInterface,
  PlaceBidInterface,
} from '../interfaces/auction.interface';
import { AuctionBusinessLogic } from '../businesslogics/auction.businesslogic';

@Controller('/')
@UseInterceptors(TransformInterceptor)
export class AuctionController {
  constructor(private readonly auctionBusinessLogic: AuctionBusinessLogic) {}

  @Post()
  async createAuction(
    @Body() createAuctionDto: CreateAuctionDto,
  ): Promise<CreateAuctionInterface> {
    await this.auctionBusinessLogic.createAuction(createAuctionDto);
    return { result: 'success' };
  }

  @Get('active')
  async getActiveAuctions(
    @Query() query: GetActiveAuctionsDto,
  ): Promise<GetActiveAuctionsInterface> {
    const activeAuctions = await this.auctionBusinessLogic.getActiveAuctions(
      query.page,
      query.limit,
    );
    return { auctions: activeAuctions };
  }

  @Post(':id/close')
  async closeAuction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CloseAuctionInterface> {
    await this.auctionBusinessLogic.closeAuction(id);
    return { result: 'success' };
  }

  @Get(':id/winner')
  async determineWinner(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetermineWinnerInterface> {
    const winnerInfo = await this.auctionBusinessLogic.getAuctionWinner(id);
    return { winner: winnerInfo };
  }

  @Post(':id/bids')
  async placeBid(
    @Param('id', ParseIntPipe) auctionId: number,
    @Body() body: PlaceBidDto,
  ): Promise<PlaceBidInterface> {
    await this.auctionBusinessLogic.placeBid(1, auctionId, body.amount);
    return { result: 'success' };
  }

  @Get(':id')
  async getAuction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetAuctionInterface> {
    const auction = await this.auctionBusinessLogic.getAuctionById(id);
    return auction;
  }
}
