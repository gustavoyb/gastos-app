import { IsOptional, IsString } from 'class-validator';

export class SubcategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryName: string;
}