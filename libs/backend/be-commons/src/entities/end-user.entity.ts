import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '.';
import { File } from './files.entity';
@Entity()
export class EndUser extends BaseEntity<EndUser> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512, unique: true })
  email!: string;

  @Column({ length: 512, select: false })
  password!: string;

  @Column({ length: 512, nullable: true })
  firstName?: string;

  @Column({ length: 512, nullable: true })
  lastName?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  blocked!: boolean;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @OneToOne(() => File)
  @JoinColumn()
  avatar!: File;
}
