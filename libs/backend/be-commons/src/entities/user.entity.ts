import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Generated,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '.';
import { File } from './files.entity';
import { Role } from './role.entity';
@Entity()
export class User extends BaseEntity<User> {
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

  @ManyToOne(() => Role)
  @JoinColumn()
  role!: Partial<Role>;

  @Column({ nullable: true })
  @Generated('uuid')
  matrixUserId?: string | null;

}
