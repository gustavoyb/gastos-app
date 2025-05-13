import { IsOptional, IsDate, IsNumber, IsEnum, IsString, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrencePeriodEnum } from 'src/enum/recurrence-period.enum';
import { CategoryTypeEnum } from 'src/enum/category-type.enum';

export class FilterTransactionDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_date?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_amount?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_amount?: number;

    @IsOptional()
    @IsEnum(CategoryTypeEnum)
    type?: CategoryTypeEnum;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    category_id?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    subcategory_id?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    account_id?: number;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_recurring?: boolean;

    @IsOptional()
    @IsEnum(RecurrencePeriodEnum)
    recurrence_period?: RecurrencePeriodEnum;

    @IsOptional()
    @IsString()
    search?: string; // Para buscar en descripción o notas

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    tags?: string[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sort_by?: string = 'date';

    @IsOptional()
    @IsString()
    sort_order?: 'ASC' | 'DESC' = 'DESC';
}