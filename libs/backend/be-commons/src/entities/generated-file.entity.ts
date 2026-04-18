import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '.';
import { File } from './files.entity';
@Entity()
export class GeneratedFile extends BaseEntity<File> {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  prompt!: string;

  @ManyToOne(() => File)
  @JoinColumn()
  file!: File;
}
