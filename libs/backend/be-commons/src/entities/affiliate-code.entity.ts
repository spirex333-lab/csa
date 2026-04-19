import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('affiliate_codes')
export class AffiliateCode {
  constructor(props: Partial<AffiliateCode>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ownerLabel?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  revenueSharePct!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
