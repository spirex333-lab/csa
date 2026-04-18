import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum RateType {
  FLOAT = 'float',
  FIXED = 'fixed',
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fromCurrency!: string;

  @IsString()
  @IsNotEmpty()
  toCurrency!: string;

  @IsNumber()
  @Min(0)
  fromAmount!: number;

  @IsString()
  @IsNotEmpty()
  toAddress!: string;

  @IsEnum(RateType)
  rateType!: RateType;

  @IsString()
  @IsOptional()
  fromNetwork?: string;

  @IsString()
  @IsOptional()
  toNetwork?: string;

  @IsString()
  @IsOptional()
  rateId?: string;
}
