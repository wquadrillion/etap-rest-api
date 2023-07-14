import { Wallet } from 'src/wallet/wallet.entity';
import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['phoneNumber'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { eager: true })
  wallets: Wallet[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
