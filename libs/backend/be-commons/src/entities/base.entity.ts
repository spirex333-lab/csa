import { Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from '.';

export abstract class BaseEntity<Props = unknown> {
  constructor(props: Partial<Props>) {
    Object.assign(this, props);
  }

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  // Tenant owner context (for MVP, tenant is represented by existing User)
  @ManyToOne(() => User, { nullable: true })
  tenant?: Partial<User>;

  // Workspace scope marker (string/slug/id from client context)
  @Column({ type: 'varchar', length: 128, nullable: true })
  workspace?: string | null;
}
