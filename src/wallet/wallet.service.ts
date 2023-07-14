import { Injectable } from '@nestjs/common';
import { Currency, Wallet } from './wallet.model';
import { User } from 'src/users/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from './wallet.entity';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { InjectPaystackClient } from 'paystack-nestjs';
import { Paystack } from 'paystack-sdk';
import { Transactions } from './transaction.entity';
import { PaystackWebhookHandler } from 'paystack-nestjs';
import { VerifyFundDto } from './dto/verify-fund.dto';
import { HttpService } from '@nestjs/axios';
import { TransactionRepository } from './transaction.repository';
import { paymentConfig } from 'src/config/payment.config';
import { TransferFundsDto } from './dto/transfer-funds.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletRepository)
    private walletRepository: WalletRepository,
    @InjectPaystackClient()
    private readonly paystackClient: Paystack,
    private readonly httpService: HttpService,
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}
  private wallets: Wallet[] = [];

  async getAllWallet(user: User): Promise<Wallet[]> {
    const query = WalletEntity.createQueryBuilder('wallet');

    query.where('wallet.userId = :userId', { userId: user.id });

    const wallet = await query.getMany();
    return wallet;
  }

  async createWallet(createWalletDto: CreateWalletDto, user: User) {
    const { currency } = createWalletDto;

    const wallet = new WalletEntity();

    wallet.currency = currency;
    wallet.user = user;
    wallet.balance = 0;
    await wallet.save();

    return { message: 'Wallet Created' };
  }

  async fundWallet(user: User, fundWalletDto: FundWalletDto) {
    const { amount, wallet_id } = fundWalletDto;

    const response = await this.paystackClient.transaction.initialize({
      email: user.phoneNumber + '@email.com',
      amount: (amount * 100).toString(),
    });
    const tranx = new Transactions();
    tranx.fromWalletId = 0;
    tranx.amount = amount * 100;
    tranx.toWalletId = wallet_id;
    tranx.currency = Currency.Naira;
    tranx.transRef = response.data.reference;
    tranx.status = 'Pending';
    tranx.userId = user.id;
    await tranx.save();
    return {
      payment_url: response.data.authorization_url,
      payment_reference: response.data.reference,
    };
  }

  async verifyFund(user: User, verifyFundDto: VerifyFundDto) {
    const { trans_ref } = verifyFundDto;

    const trans = await Transactions.findOne({
      where: {
        transRef: trans_ref,
      },
    });

    if (trans && trans.status === 'success') {
      return { message: 'Transaction was successfull' };
    } else if (trans.status === 'Pending') {
      const headers = {
        Authorization: `Bearer ${paymentConfig.PAYSTACK_TEST_KEY}`,
      };

      const response = await this.httpService.axiosRef.get(
        paymentConfig.PAYSTACK_BASE_URL +
          paymentConfig.PAYSTACK_VERIFY_URL +
          trans_ref,
        { headers: headers },
      );

      if (response.data.data.status === 'success') {
        //update balance
        trans.status = 'success';
        trans.save();

        const wallet = await WalletEntity.findOneBy({
          id: trans.toWalletId,
        });

        wallet.balance = wallet.balance + trans.amount;
        wallet.save();

        return { message: 'Transaction successfull' };
      } else {
        return { message: 'Transaction Unsuccessfull' };
      }
    }
  }

  async transferFund(user: User, transferFundsDto: TransferFundsDto) {
    const { fromWalletId, toWalletId, amount } = transferFundsDto;

    const wallet = await WalletEntity.findOneBy({
      id: fromWalletId,
    });
    if (amount * 100 > wallet.balance) {
      return { message: 'Insuficient Fund!' };
    }
    const tranx = new Transactions();
    tranx.fromWalletId = fromWalletId;
    tranx.toWalletId = toWalletId;
    tranx.currency = Currency.Naira;
    tranx.transRef = await this.generateRandomString(12);
    tranx.amount > 1000000
      ? (tranx.status = 'Pending')
      : (tranx.status = 'success');
    tranx.amount = amount * 100;
    tranx.userId = user.id;
    await tranx.save();

    if (tranx.status === 'success') {
      const toWallet = await WalletEntity.findOneBy({
        id: toWalletId,
      });
      toWallet.balance = toWallet.balance + amount * 100;
      toWallet.save();

      const fromWallet = await WalletEntity.findOneBy({
        id: toWalletId,
      });
      fromWallet.balance = fromWallet.balance - amount * 100;
      fromWallet.save();
      return { message: 'Transaction successfull' };
    } else {
      return { message: 'Transaction is pending admin aproval' };
    }
  }

  async confirm(user: User, transferFundsDto: TransferFundsDto) {
    const { fromWalletId, toWalletId, amount } = transferFundsDto;
  }

  @PaystackWebhookHandler('charge.success')
  async handleChargeSuccess(payload) {
    console.log('from ChargeSuccessService');
    console.log(`handling ${payload.event}`);
  }

  @PaystackWebhookHandler('transfer.success')
  async handleChargeFailure(payload) {
    console.log('from transferSuccessService');
    console.log(`handling ${payload.event}`);
  }

  private async generateRandomString(myLength): Promise<string> {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)],
    );

    const randomString = randomArray.join('');
    return randomString;
  }

  async getMonthlyPaymentSummaries(year: number, month: number) {
    // Get monthly payment summaries
    const payments = await Transactions.find({
      where: {
        //YEAR(date): year,
        //MONTH(date): month,
      },
    });
    return payments;
  }
}
