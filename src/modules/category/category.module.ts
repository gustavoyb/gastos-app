import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryTypeModule } from '../category-type/category-type.module';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        CategoryTypeModule
    ],
    providers: [CategoryService],
    exports: [TypeOrmModule, CategoryService]
})
export class CategoryModule { } 