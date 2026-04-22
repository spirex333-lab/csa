import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';
import { InternalOrderStatus } from '@workspace/commons/dtos/orders/orders.dto';
import { RateType } from '@workspace/commons/dtos/change-now/create-order.dto';

@Entity('orders')
export class Orders extends BaseEntity<Orders> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  fromCanonical!: string;

  @Column({ type: 'varchar', length: 20 })
  toCanonical!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  fromAmount!: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  expectedToAmount?: number;

  @Column({ type: 'varchar', length: 255 })
  depositAddress!: string;

  @Column({ type: 'varchar', length: 255 })
  toAddress!: string;

  @Column({ type: 'varchar', length: 32, default: InternalOrderStatus.AWAITING_DEPOSIT })
  status!: InternalOrderStatus;

  @Column({ type: 'varchar', length: 10, default: RateType.FLOAT })
  rateType!: RateType;

  @Column({ type: 'varchar', length: 32 })
  provider!: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  externalId!: string;
}
