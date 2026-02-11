import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  balance: string;
  
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  reservedBalance: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
