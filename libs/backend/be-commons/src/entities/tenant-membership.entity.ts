import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('tenant_memberships')
@Index('idx_tenant_member_unique', ['tenant', 'member'], { unique: true })
export class TenantMembership extends BaseEntity<TenantMembership> {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  override tenant!: Partial<User>;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'memberId' })
  member!: Partial<User>;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role!: Partial<Role>;
}
