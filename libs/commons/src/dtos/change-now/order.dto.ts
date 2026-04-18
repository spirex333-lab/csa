export enum OrderStatus {
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  EXCHANGING = 'exchanging',
  SENDING = 'sending',
  FINISHED = 'finished',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
}

export class OrderDto {
  id!: string;
  fromCurrency!: string;
  toCurrency!: string;
  fromAmount!: number;
  expectedToAmount!: number;
  depositAddress!: string;
  toAddress!: string;
  status!: OrderStatus;
  rateType!: string;
  createdAt!: string;
}

export class OrderStatusDto {
  id!: string;
  status!: OrderStatus;
  fromAmount!: number;
  toAmount?: number;
  depositAddress!: string;
  updatedAt!: string;
}
