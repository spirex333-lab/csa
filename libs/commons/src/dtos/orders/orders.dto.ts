import { RateType } from './create-orders.dto';

export enum InternalOrderStatus {
  AWAITING_DEPOSIT = 'awaiting_deposit',
  CONFIRMING = 'confirming',
  EXCHANGING = 'exchanging',
  SENDING = 'sending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed',
  REFUNDING = 'refunding',
}

export class OrdersDto {
  id!: string;
  fromCanonical!: string;
  toCanonical!: string;
  fromAmount!: number;
  expectedToAmount?: number;
  depositAddress!: string;
  toAddress!: string;
  status!: InternalOrderStatus;
  rateType!: RateType;
  provider!: string;
  externalId!: string;
  createdAt!: Date;
}
