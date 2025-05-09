import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';
import { CategoryTypeService } from './category-type.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryType])],
    providers: [CategoryTypeService],
    exports: [TypeOrmModule, CategoryTypeService]
})
export class CategoryTypeModule { } 