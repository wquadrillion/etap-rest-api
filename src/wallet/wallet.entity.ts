import { User } from '../users/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Currency } from './wallet.model';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: Currency;

  @Column()
  balance: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
