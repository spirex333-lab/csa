import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChangeNow } from './change-now.entity';
import { Orders } from './orders.entity';

@Entity('order_events')
export class OrderEvent {
  constructor(props: Partial<OrderEvent>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => ChangeNow, { onDelete: 'CASCADE' })
  order!: ChangeNow;

  // Internal order record — nullable so pre-migration events remain valid
  @Index()
  @ManyToOne(() => Orders, { nullable: true, onDelete: 'SET NULL' })
  internalOrder?: Orders;

  @Column({ type: 'varchar', length: 64 })
  eventType!: string;

  @Column({ type: 'json', nullable: true })
  payload?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
