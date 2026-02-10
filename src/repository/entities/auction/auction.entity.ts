import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { AuctionStatus } from 'src/module/auction/enums/auction.enum';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
  })
  status: AuctionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  startingPrice: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentHighestBid?: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp' })
  endsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'winner_id' })
  winner?: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;
}
