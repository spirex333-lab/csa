export const TENANT_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type TenantRoleName = (typeof TENANT_ROLE)[keyof typeof TENANT_ROLE];

export const TENANT_ROLE_NAMES: TenantRoleName[] = [
  TENANT_ROLE.OWNER,
  TENANT_ROLE.ADMIN,
  TENANT_ROLE.MEMBER,
];

export const TENANT_MANAGE_ALLOWED_ROLES: TenantRoleName[] = [
  TENANT_ROLE.OWNER,
  TENANT_ROLE.ADMIN,
];
