export class QuoteRequestDto {
  fromCurrency!: string;
  toCurrency!: string;
  fromAmount!: number;
  fromNetwork?: string;
  toNetwork?: string;
}

export class QuoteResponseDto {
  fromAmount!: number;
  /** Mapped from API's toAmount field (v2) */
  toAmount!: number;
  rateId?: string;
  validUntil?: string;
  provider!: string;
}
