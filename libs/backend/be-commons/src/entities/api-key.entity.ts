import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class ApiKey extends BaseEntity<ApiKey> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @Generated('uuid')
  key!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
