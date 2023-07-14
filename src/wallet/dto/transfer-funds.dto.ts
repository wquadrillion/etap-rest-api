import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferFundsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  fromWalletId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  toWalletId: number;
}
