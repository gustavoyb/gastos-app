import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CategoryModule } from '../category/category.module';
import { SubcategoryService } from './subcategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategory]),
    CategoryModule
  ],
  providers: [SubcategoryService],
  exports: [TypeOrmModule, SubcategoryService]
})
export class SubcategoryModule { }