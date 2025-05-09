import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryType])],
    exports: [TypeOrmModule]
})
export class CategoryTypeModule { } 