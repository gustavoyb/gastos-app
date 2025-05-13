import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { AccountTypeEnum } from 'src/enum/account-type.enum';

export class CreateAccountDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEnum(AccountTypeEnum, { message: 'Tipo de cuenta inválido' })
    type: AccountTypeEnum;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(9999999999.99)
    current_balance?: number;

    @IsOptional()
    @IsString()
    @Length(3, 3, { message: 'El código de moneda debe tener exactamente 3 caracteres' })
    currency?: string;
}