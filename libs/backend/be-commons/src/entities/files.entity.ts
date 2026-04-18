import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';

@Entity()
export class File extends BaseEntity<File> {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 1024 })
  originalName!: string;

  @Column()
  path!: string;

  @Column()
  size!: number;

  @Column({ length: 512 })
  mimeType!: string;
}
