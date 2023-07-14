import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.entity';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { PaystackWebhookDto } from './dto/paystack-webhoo.dto';
import { VerifyFundDto } from './dto/verify-fund.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';

@Controller('wallet')
@UseGuards(AuthGuard())
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getAllwallet(@GetUser() user: User) {
    return this.walletService.getAllWallet(user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createWallet(
    @Body() createWalletDto: CreateWalletDto,
    @GetUser()
    user: User,
  ) {
    return this.walletService.createWallet(createWalletDto, user);
  }

  @Get('fund')
  @UsePipes(ValidationPipe)
  fundWallet(@Body() fundWalletDto: FundWalletDto, @GetUser() user: User) {
    return this.walletService.fundWallet(user, fundWalletDto);
  }

  @Get('fund_status')
  verifyFund(@Body() verifyFundDto: VerifyFundDto, @GetUser() user: User) {
    return this.walletService.verifyFund(user, verifyFundDto);
  }

  @Post('transfer')
  @UsePipes(ValidationPipe)
  transferFund(
    @Body() transferFundsDto: TransferFundsDto,
    @GetUser() user: User,
  ) {
    return this.walletService.transferFund(user, transferFundsDto);
  }

  @Post('webhook')
  async handleWebhook(@Body() webhookData: PaystackWebhookDto): Promise<any> {
    // Handle the webhook event based on the event type
    const { event, data } = webhookData;
    switch (event) {
      case 'charge.success':
        // Handle successful charge event
        await this.walletService.handleChargeSuccess(data);
        break;
      case 'charge.failure':
        // Handle failed charge event
        await this.walletService.handleChargeFailure(data);
        break;
      // Handle other event types as needed
    }
  }
}
