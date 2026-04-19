export class QuoteRequestDto {
  /** Canonical ticker, e.g. "BTC", "USDT_ERC20" */
  fromCanonical!: string;
  /** Canonical ticker, e.g. "ETH", "USDT_TRC20" */
  toCanonical!: string;
  fromAmount!: number;
}

export class QuoteResponseDto {
  fromAmount!: number;
  toAmount!: number;
  rateId?: string;
  validUntil?: string;
  provider!: string;
}
