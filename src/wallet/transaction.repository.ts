import { EntityRepository, Repository } from 'typeorm';
import { Transactions } from './transaction.entity';

@EntityRepository(Transactions)
export class TransactionRepository extends Repository<Transactions> {}
