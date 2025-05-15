import { Module } from "@nestjs/common";
import { CategoryTypeModule } from "src/modules/category-type/category-type.module";
import { CategoryModule } from "src/modules/category/category.module";
import { SubcategoryModule } from "src/modules/subcategory/subcategory.module";
import { CategorySeeder } from "./seeders/category.seeder";
import { UserDataSeeder } from "./seeders/user-data.seeder";
import { UserModule } from "src/modules/user/user.module";
import { AccountModule } from "src/modules/account/account.module";
import { TransactionModule } from "src/modules/transaction/transaction.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/modules/category/entities/category.entity";
import { Subcategory } from "src/modules/subcategory/entities/subcategory.entity";

@Module({
    imports: [
        CategoryTypeModule,
        CategoryModule,
        SubcategoryModule,
        UserModule,
        AccountModule,
        TransactionModule,
        TypeOrmModule.forFeature([Category, Subcategory])
    ],
    providers: [CategorySeeder, UserDataSeeder],
    exports: [CategorySeeder, UserDataSeeder],
})
export class DatabaseModule { }