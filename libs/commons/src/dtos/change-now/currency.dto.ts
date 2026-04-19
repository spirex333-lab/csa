export class CurrencyDto {
  /** App-internal canonical key, e.g. "BTC", "USDT_ERC20" */
  canonicalTicker!: string;
  label!: string;
  network!: string;
  image!: string;
  buy!: boolean;
  sell!: boolean;
}
