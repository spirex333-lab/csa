import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { TenantMembershipService } from './tenant-membership.service';

describe('TenantMembershipService cross-tenant isolation', () => {
  const membershipRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  } as any;

  const userRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  } as any;

  const roleRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as any;

  let service: TenantMembershipService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TenantMembershipService(membershipRepo, userRepo, roleRepo);
  });

  it('denies addMember when actor has no membership in tenant (cross-tenant)', async () => {
    membershipRepo.findOne
      .mockResolvedValueOnce(null); // assertCanManage actor lookup

    await expect(
      service.addMember(tenantA, actorFromTenantB, { email: 'member@local.com' })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('denies updateRole when membership id belongs to another tenant', async () => {
    membershipRepo.findOne
      .mockResolvedValueOnce({ id: 1, role: { name: 'owner' } }) // assertCanManage actor membership in tenant A
      .mockResolvedValueOnce(null); // target membership not found in tenant A scope

    await expect(
      service.updateRole(tenantA, actorFromTenantA, 99, { roleName: 'member' })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('denies removeMember when membership id belongs to another tenant', async () => {
    membershipRepo.findOne
      .mockResolvedValueOnce({ id: 1, role: { name: 'admin' } }) // assertCanManage actor membership in tenant A
      .mockResolvedValueOnce(null); // target membership not found in tenant A scope

    await expect(service.removeMember(tenantA, actorFromTenantA, 88)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});

const tenantA = 101;
const actorFromTenantA = 1001;
const actorFromTenantB = 2002;
