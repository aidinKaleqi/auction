import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
} from 'typeorm';
import { AuctionEntity } from './auction.entity';
import { UserEntity } from '../user/user.entity';
import { BidStatus } from 'src/module/auction/enums/bid.enum';

@Entity('bids')
@Check(`"amount" > 0`)
@Check(`"createdAt" <= CURRENT_TIMESTAMP`)
@Index('idx_bids_auction_id', ['auction'])
@Index('idx_bids_bidder_id', ['bidder'])
@Index('idx_bids_auction_amount', ['auction', 'amount'])
export class BidEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => AuctionEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction' })
  auction: AuctionEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bidder' })
  bidder: UserEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({
    type: 'enum',
    enum: BidStatus,
  })
  status: BidStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bidReason?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
