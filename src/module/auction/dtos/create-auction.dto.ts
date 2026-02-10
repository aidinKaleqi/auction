import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsISO8601,
} from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  startingPrice: string;

  @IsISO8601()
  @IsNotEmpty()
  startsAt: string;

  @IsISO8601()
  @IsNotEmpty()
  endsAt: string;
}
