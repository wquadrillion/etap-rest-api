import { EntityRepository, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { User } from 'src/users/user.entity';

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
  async createWallet(createWalletDto: CreateWalletDto, user: User) {
    const { currency } = createWalletDto;

    const wallet = new Wallet();

    wallet.currency = currency;
    wallet.user = user;
    await wallet.save();

    return wallet;
  }
}
