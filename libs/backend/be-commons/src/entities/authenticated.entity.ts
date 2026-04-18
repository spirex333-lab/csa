import { Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export class BaseEntity {
  @ManyToOne(() => User)
  user!: Partial<User>;

  constructor(props: Partial<Props>) {
    Object.assign(this, props);
  }

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;
}
