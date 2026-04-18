import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';

@Entity()
export class Role extends BaseEntity<Role> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512 })
  name!: string;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

}
