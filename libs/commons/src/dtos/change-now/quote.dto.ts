export class QuoteRequestDto {
  fromCurrency!: string;
  toCurrency!: string;
  fromAmount!: number;
  fromNetwork?: string;
  toNetwork?: string;
}

export class QuoteResponseDto {
  fromAmount!: number;
  toAmount!: number;
  rateId?: string;
  validUntil?: string;
  provider!: string;
}
