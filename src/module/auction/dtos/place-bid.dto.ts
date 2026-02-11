import { IsNumberString, IsNotEmpty, IsOptional } from 'class-validator';

export class PlaceBidDto {
  @IsNumberString({}, { message: 'Amount must be a valid number' })
  @IsNotEmpty()
  amount: string;

  @IsOptional()
  @IsNotEmpty()
  bidReason: string;
}