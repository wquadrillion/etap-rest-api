import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { WalletModule } from './wallet/wallet.module';
import { UserRepository } from './users/user.repository';
import { WalletRepository } from './wallet/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    WalletModule,
    TypeOrmModule.forFeature([UserRepository, WalletRepository]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
