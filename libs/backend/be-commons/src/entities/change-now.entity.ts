import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';
import { RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import { OrderStatus } from '@workspace/commons/dtos/change-now/order.dto';

@Entity('change_now_orders')
export class ChangeNow extends BaseEntity<ChangeNow> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  fromCurrency!: string;

  @Column({ type: 'varchar', length: 20 })
  toCurrency!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  fromAmount!: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  expectedToAmount?: number;

  @Column({ type: 'varchar', length: 255 })
  depositAddress!: string;

  @Column({ type: 'varchar', length: 255 })
  toAddress!: string;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.WAITING })
  status!: OrderStatus;

  @Column({ type: 'varchar', length: 10, default: RateType.FLOAT })
  rateType!: RateType;

  @Column({ type: 'varchar', length: 100 })
  externalId!: string;

  @Column({ type: 'varchar', length: 20, default: 'changenow' })
  provider!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  orderToken?: string;
}
