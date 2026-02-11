import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuctionStatus } from 'src/module/auction/enums/auction.enum';

@Entity('auctions')
@Index("idx_auctions_status_ends_at", ["status", "endsAt"])
@Index("idx_auctions_winner_id", ["winner"])
export class AuctionEntity {
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

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'winner' })
  winner?: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserEntity;
}
