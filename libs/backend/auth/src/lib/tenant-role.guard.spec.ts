import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TenantRoleGuard } from './tenant-role.guard';

describe('TenantRoleGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  const makeContext = (tenantRole?: string): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ tenantRole }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
    } as unknown as ExecutionContext);

  it('allows when no role metadata is declared', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(undefined);
    const guard = new TenantRoleGuard(reflector);
    expect(guard.canActivate(makeContext('member'))).toBe(true);
  });

  it('denies when tenant role is not in allowed roles', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['owner', 'admin']);
    const guard = new TenantRoleGuard(reflector);

    expect(() => guard.canActivate(makeContext('member'))).toThrow(ForbiddenException);
  });

  it('allows when tenant role is in allowed roles', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['owner', 'admin']);
    const guard = new TenantRoleGuard(reflector);

    expect(guard.canActivate(makeContext('admin'))).toBe(true);
  });
});
