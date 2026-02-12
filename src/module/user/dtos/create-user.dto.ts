import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message:
      'Balance must be a valid decimal number with up to 2 decimal places',
  })
  balance: string;
}
