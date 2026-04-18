import { SetMetadata } from '@nestjs/common';

export const TENANT_ROLES_KEY = 'tenantRoles';
export const TenantRoles = (...roles: string[]) => SetMetadata(TENANT_ROLES_KEY, roles);
