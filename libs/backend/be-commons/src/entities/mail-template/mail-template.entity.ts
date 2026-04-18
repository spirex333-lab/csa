import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '..';
@Entity()
export class MailTemplate extends BaseEntity<MailTemplate> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  html!: string;
}
