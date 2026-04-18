import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';

@Entity()
export class Test extends BaseEntity<Test> {
  @PrimaryGeneratedColumn()
  id!: string;

  // TODO: add entity columns
  @Column({ type: 'text', nullable: true })
  description?: string | null;
}
