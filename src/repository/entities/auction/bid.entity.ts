import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Auction } from './auction.entity';
import { User } from '../user/user.entity';
import { BidStatus } from 'src/module/auction/enums/bid.enum';

@Entity('bids')
@Check(`"amount" > 0`)
@Check(`"created_at" <= CURRENT_TIMESTAMP`)
export class Bid {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Auction, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bidder_id' })
  bidder: User;

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
