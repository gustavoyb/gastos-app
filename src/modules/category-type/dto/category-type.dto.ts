import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryTypeEnum } from "src/enum/category-type.enum";

export class CategoryTypeDto {
    @IsEnum(CategoryTypeEnum)
    name: CategoryTypeEnum;
  
    @IsOptional()
    @IsString()
    description?: string;
}