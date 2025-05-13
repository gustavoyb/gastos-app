import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { UserModule } from '../user/user.module';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { AccountModule } from '../account/account.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        UserModule,
        SubcategoryModule,
        AccountModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule { }