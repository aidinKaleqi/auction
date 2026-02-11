import { AuctionEntity } from 'src/repository/entities/auction/auction.entity';
import { AuctionStatus } from '../enums/auction.enum';
import { BidEntity } from 'src/repository/entities/auction/bid.entity';

export interface CreateAuctionInterface {
  result: string;
}

export interface GetAuctionInterface {
  id: number;
  title: string;
  description?: string;
  status: AuctionStatus;
  startingPrice: string;
  currentHighestBid?: string;
  version: number;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  closedAt?: Date;
  winner?: {
    id: number;
  };
  createdBy: {
    id: number;
  };
}

export interface GetActiveAuctionsInterface {
  auctions: AuctionEntity[];
}

export interface CloseAuctionInterface {
  result: string;
}

export interface DetermineWinnerInterface {
  winner: AuctionEntity['winner'];
}

export interface PlaceBidInterface {
  result: string;
}

export interface GetBidsInterface {
  bids: BidEntity[];
}
