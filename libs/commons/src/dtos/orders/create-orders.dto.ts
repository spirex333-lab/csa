import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsValidWalletAddress } from '@workspace/commons/validation/is-valid-wallet-address.decorator';
import { RateType } from '../change-now/create-order.dto';

export { RateType };

export class CreateOrdersDto {
  @IsString()
  @IsNotEmpty()
  fromCanonical!: string;

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
