import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { PaystackModule } from 'paystack-nestjs';
import { HttpModule } from '@nestjs/axios';
import { TransactionRepository } from './transaction.repository';
import { paymentConfig } from 'src/config/payment.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletRepository, TransactionRepository]),
    UserModule,
    HttpModule,
    PaystackModule.forRoot(PaystackModule, {
      secretKey: paymentConfig.PAYSTACK_TEST_KEY,
      enableWebhook: true,
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
