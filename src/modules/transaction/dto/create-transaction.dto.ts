// src/modules/transaction/dto/create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional, IsBoolean, IsEnum, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrencePeriodEnum } from 'src/enum/recurrence-period.enum';

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(-9999999.99)
    @Max(9999999.99)
    amount: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsInt()
    subcategory_id: number;

    @IsNotEmpty()
    @IsInt()
    account_id: number;

    @IsOptional()
    @IsBoolean()
    is_recurring?: boolean;

    @IsOptional()
    @IsEnum(RecurrencePeriodEnum, { message: 'Período de recurrencia inválido' })
    recurrence_period?: RecurrencePeriodEnum;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    tags?: string;
}