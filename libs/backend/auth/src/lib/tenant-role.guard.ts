import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_ROLES_KEY } from '@workspace/be-commons/decorators/tenant-roles.decorator';

@Injectable()
export class TenantRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowed = this.reflector.getAllAndOverride<string[]>(TENANT_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowed?.length) return true;

    const request = context.switchToHttp().getRequest();
    const role = String(request?.tenantRole ?? '').toLowerCase();

    if (!role || !allowed.map((r) => r.toLowerCase()).includes(role)) {
      throw new ForbiddenException('Insufficient tenant role');
    }
    return true;
  }
}
