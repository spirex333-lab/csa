import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, TenantMembership, User } from '@workspace/be-commons/entities';
import { Repository } from 'typeorm';

import {
  TENANT_MANAGE_ALLOWED_ROLES,
  TENANT_ROLE,
  TENANT_ROLE_NAMES,
  type TenantRoleName,
} from './tenant-roles.constants';

export type MembershipRoleName = TenantRoleName;

export type AddTenantMemberInput = {
  memberId?: number;
  email?: string;
  roleId?: number;
  roleName?: MembershipRoleName;
};

@Injectable()
export class TenantMembershipService {
  constructor(
    @InjectRepository(TenantMembership)
    private readonly membershipRepo: Repository<TenantMembership>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}

  async ensureOwnerMembership(tenantId: number) {
    await this.ensureTenantRoles(tenantId);
    const existing = await this.membershipRepo.findOne({
      where: { tenant: { id: tenantId }, member: { id: tenantId } },
    });
    if (existing?.id) return existing;

    const ownerRole = await this.getTenantRoleByName(tenantId, TENANT_ROLE.OWNER);
    const owner = this.membershipRepo.create({
      tenant: { id: tenantId },
      member: { id: tenantId },
      role: { id: ownerRole.id },
    });
    return this.membershipRepo.save(owner);
  }


  async getMembership(tenantId: number, memberId: number) {
    return this.membershipRepo.findOne({
      where: { tenant: { id: tenantId }, member: { id: memberId } },
      relations: { role: true },
    });
  }

  async listByTenant(tenantId: number) {
    return this.membershipRepo.find({
      where: { tenant: { id: tenantId } },
      relations: { member: true, role: true },
      order: { id: 'ASC' },
    });
  }

  async addMember(tenantId: number, actorId: number, dto: AddTenantMemberInput) {
    await this.assertCanManage(tenantId, actorId);

    await this.ensureTenantRoles(tenantId);
    const role = await this.resolveRole(tenantId, dto);

    let member: User | null = null;
    if (dto.memberId) {
      member = await this.userRepo.findOne({ where: { id: dto.memberId } });
    } else if (dto.email?.length) {
      member = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    }

    if (!member?.id) {
      throw new NotFoundException('Member user not found');
    }

    const existing = await this.membershipRepo.findOne({
      where: { tenant: { id: tenantId }, member: { id: member.id } },
    });
    if (existing?.id) {
      throw new BadRequestException('Member already exists in tenant');
    }

    if (!member.tenant?.id) {
      member.tenant = { id: tenantId };
      await this.userRepo.save(member);
    }

    const created = this.membershipRepo.create({
      tenant: { id: tenantId },
      member: { id: member.id },
      role: { id: role.id },
    });

    return this.membershipRepo.save(created);
  }

  async updateRole(tenantId: number, actorId: number, membershipId: number, roleInput: { roleId?: number; roleName?: MembershipRoleName }) {
    await this.assertCanManage(tenantId, actorId);

    const membership = await this.membershipRepo.findOne({
      where: { id: membershipId, tenant: { id: tenantId } },
      relations: { member: true, role: true },
    });
    if (!membership?.id) throw new NotFoundException('Membership not found');

    const nextRole = await this.resolveRole(tenantId, roleInput);
    if (membership.role?.name?.toLowerCase?.() === TENANT_ROLE.OWNER && nextRole.name.toLowerCase() !== TENANT_ROLE.OWNER) {
      throw new ForbiddenException('Owner role cannot be downgraded');
    }

    membership.role = { id: nextRole.id };
    return this.membershipRepo.save(membership);
  }

  async removeMember(tenantId: number, actorId: number, membershipId: number) {
    await this.assertCanManage(tenantId, actorId);

    const membership = await this.membershipRepo.findOne({
      where: { id: membershipId, tenant: { id: tenantId } },
      relations: { role: true },
    });
    if (!membership?.id) throw new NotFoundException('Membership not found');

    if (membership.role?.name?.toLowerCase?.() === TENANT_ROLE.OWNER) {
      throw new ForbiddenException('Owner cannot be removed');
    }

    await this.membershipRepo.delete({ id: membershipId });
    return { deleted: true };
  }

  private async assertCanManage(tenantId: number, actorId: number) {
    const actor = await this.membershipRepo.findOne({
      where: { tenant: { id: tenantId }, member: { id: actorId } },
      relations: { role: true },
    });

    if (!actor?.id) throw new ForbiddenException('No tenant membership');
    const roleName = actor.role?.name?.toLowerCase?.();
    if (!TENANT_MANAGE_ALLOWED_ROLES.includes(roleName as TenantRoleName)) {
      throw new ForbiddenException('Insufficient role to manage members');
    }
  }

  private async ensureTenantRoles(tenantId: number) {
    for (const roleName of TENANT_ROLE_NAMES) {
      const exists = await this.roleRepo.findOne({
        where: { tenant: { id: tenantId }, name: roleName },
      });
      if (exists?.id) continue;
      const created = this.roleRepo.create({
        tenant: { id: tenantId },
        name: roleName,
        isAdmin: roleName === TENANT_ROLE.OWNER || roleName === TENANT_ROLE.ADMIN,
        isPublic: false,
      });
      await this.roleRepo.save(created);
    }
  }

  private async getTenantRoleByName(tenantId: number, roleName: MembershipRoleName) {
    const role = await this.roleRepo.findOne({ where: { tenant: { id: tenantId }, name: roleName } });
    if (!role?.id) throw new BadRequestException(`Missing tenant role: ${roleName}`);
    return role;
  }

  private async resolveRole(tenantId: number, dto: { roleId?: number; roleName?: MembershipRoleName }) {
    if (dto?.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: dto.roleId, tenant: { id: tenantId } } });
      if (!role?.id) throw new BadRequestException('Invalid roleId');
      return role;
    }

    const roleName = (dto?.roleName ?? TENANT_ROLE.MEMBER) as MembershipRoleName;
    if (!TENANT_ROLE_NAMES.includes(roleName)) throw new BadRequestException('Invalid roleName');
    return this.getTenantRoleByName(tenantId, roleName);
  }

}
