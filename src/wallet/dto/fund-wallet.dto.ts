import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  wallet_id: number;
}
