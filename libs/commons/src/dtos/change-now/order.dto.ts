export enum OrderStatus {
  NEW = 'new',
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  EXCHANGING = 'exchanging',
  SENDING = 'sending',
  FINISHED = 'finished',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  VERIFYING = 'verifying',
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
  /** Amount sent by user (amountSend in API response) */
  fromAmount?: number;
  /** Amount received (amountReceive in API response) */
  toAmount?: number;
  expectedSendAmount?: number;
  expectedReceiveAmount?: number;
  depositAddress!: string;
  payoutAddress?: string;
  updatedAt!: string;
}
