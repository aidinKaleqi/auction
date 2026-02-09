import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { AuctionService } from '../services/auction.service';

@Controller('/')
@UseInterceptors(TransformInterceptor)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}
}
