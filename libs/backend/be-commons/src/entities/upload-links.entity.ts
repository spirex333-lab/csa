import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class UploadLink extends BaseEntity<UploadLink> {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: true })
  active!: boolean;

  @Column({ generated: 'uuid' })
  key!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer!: User;
}
