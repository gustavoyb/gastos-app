import { IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';
import { CategoryTypeEnum } from 'src/enum/category-type.enum';

export class CategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsEnum(CategoryTypeEnum)
  typeName: CategoryTypeEnum;
}