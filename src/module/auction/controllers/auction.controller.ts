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
import {
  CreateAuctionInterface,
  GetAuctionInterface,
  GetActiveAuctionsInterface,
  CloseAuctionInterface,
} from '../interfaces/auction.interface';
import { CustomEvent } from 'src/filter/custom.event';

@Controller('/')
@UseInterceptors(TransformInterceptor)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async createAuction(
    @Body() createAuctionDto: CreateAuctionDto,
  ): Promise<CreateAuctionInterface> {
    await this.auctionService.createAuction(createAuctionDto);
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
