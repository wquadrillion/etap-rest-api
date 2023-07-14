import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Transactions } from 'src/wallet/transaction.entity';
import { TransactionRepository } from 'src/wallet/transaction.repository';
import { Wallet } from 'src/wallet/wallet.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'userola',
  password: 'H@cks12',
  database: 'etap',
  autoLoadEntities: true,
  synchronize: true,
  entities: [User, Wallet, Transactions],
};
