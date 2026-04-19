export class CurrencyDto {
  ticker!: string;
  name!: string;
  image!: string;
  network!: string;
  hasExternalId!: boolean;
  isExtraIdSupported!: boolean;
  isFiat!: boolean;
  featured!: boolean;
  isStable!: boolean;
  supportsFixedRate!: boolean;
  tokenContract!: string | null;
  buy!: boolean;
  sell!: boolean;
  legacyTicker!: string;
}
