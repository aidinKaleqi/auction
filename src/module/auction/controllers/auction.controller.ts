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
import { AuctionService } from '../services/auction.service';
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
import { CustomEvent } from 'src/filter/custom.event';
import { UserService } from '../../user/services/user.service';
import { AuctionBusinessLogic } from '../businesslogics/auction.businesslogic';

@Controller('/')
@UseInterceptors(TransformInterceptor)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService, private readonly userService: UserService,
    private readonly auctionBusinessLogic: AuctionBusinessLogic
  ) {}

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
    const { page = 1, limit = 10 } = query;
    const activeAuctions = await this.auctionService.getActiveAuctions(
      page,
      limit,
    );
    return { auctions: activeAuctions };
  }

  @Post(':id/close')
  async closeAuction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CloseAuctionInterface> {
    const { exists } = await this.auctionService.getAuctionById(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    await this.auctionService.closeAuction(id);
    return { result: 'success' };
  }

  @Post(':id/winner')
  async determineWinner(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetermineWinnerInterface> {
    const { body, exists } = await this.auctionService.getAuctionWinner(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    if (body.status !== 'closed') {
      throw new CustomEvent('Auction Not Closed', 400);
    }
    return { winner: body.winner };
  }

  @Post(':id/bids')
  async placeBid(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PlaceBidDto,
  ): Promise<PlaceBidInterface> {
    const { body: auctionBody, exists } =
      await this.auctionService.getAuctionById(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    if (auctionBody.status !== 'active') {
      throw new CustomEvent('Auction Not Active', 400);
    }
    if (auctionBody.endsAt <= new Date()) {
      throw new CustomEvent('Auction has ended', 400);
    }
    if (!this.auctionService.validateBidAmount(auctionBody, body.amount)) {
      throw new CustomEvent('Bid must be higher than current highest bid', 400);
    }
    const hasSufficientBalance = await this.userService.ensureUserHasSufficientBalance(Number(body.amount));
    if (!hasSufficientBalance) {
      throw new CustomEvent('Insufficient balance', 400);
    }
    await this.auctionService.placeBid(1, auctionBody, body.amount);
    return { result: 'success' };
  }

  @Get(':id')
  async getAuction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetAuctionInterface> {
    const { body, exists } = await this.auctionService.getAuctionById(id);
    if (!exists) {
      throw new CustomEvent('Auction Not Found', 404);
    }
    return body;
  }
}
