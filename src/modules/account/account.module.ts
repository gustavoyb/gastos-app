import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UserModule } from '../user/user.module';
import { Account } from './entitites/account.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        UserModule,
    ],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule { }