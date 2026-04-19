import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsValidWalletAddress } from '@workspace/be-commons/decorators/is-valid-wallet-address.decorator';

export enum RateType {
  FLOAT = 'float',
  FIXED = 'fixed',
}

export class CreateOrderDto {
  /** Canonical ticker, e.g. "BTC", "USDT_ERC20" */
  @IsString()
  @IsNotEmpty()
  fromCanonical!: string;

  /** Canonical ticker, e.g. "ETH", "USDT_TRC20" */
  @IsString()
  @IsNotEmpty()
  toCanonical!: string;

  @IsNumber()
  @Min(0)
  fromAmount!: number;

  @IsString()
  @IsNotEmpty()
  @IsValidWalletAddress('toCanonical')
  toAddress!: string;

  @IsEnum(RateType)
  rateType!: RateType;

  @IsString()
  @IsOptional()
  rateId?: string;
}
