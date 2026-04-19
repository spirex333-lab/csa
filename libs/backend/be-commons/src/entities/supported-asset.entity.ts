import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('supported_assets')
export class SupportedAsset {
  constructor(props: Partial<SupportedAsset>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  ticker!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  network!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  minAmount?: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  maxAmount?: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @UpdateDateColumn()
  lastSyncedAt!: Date;
}
