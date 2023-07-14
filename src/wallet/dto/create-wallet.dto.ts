import { IsNotEmpty, IsString } from 'class-validator';
import { Currency } from '../wallet.model';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  currency: Currency;
}
