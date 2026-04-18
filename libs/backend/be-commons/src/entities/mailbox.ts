import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';
@Entity()
export class Mailbox extends BaseEntity<Mailbox> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512 })
  name!: string;

  @Column({ length: 2048 })
  host!: string;

  @Column({ type: 'integer' })
  port!: number;

  @Column({ length: 1024 })
  username!: string;

  @Column({ length: 512 })
  password!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
