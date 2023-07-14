import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Currency } from './wallet.model';

@Entity()
export class Transactions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: Currency;

  @Column()
  amount: number;

  @Column()
  fromWalletId: number;

  @Column()
  transRef: string;

  @Column()
  toWalletId?: number;

  @Column()
  status: string;

  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  date: Date;
}
