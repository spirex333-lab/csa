import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiKeyService } from './api-key.service';
import { UsersService } from './user.service';
import { Request } from 'express';
import { TenantMembershipService } from './tenant-membership.service';
import { ENV_MASTER_KEY } from '@workspace/be-commons';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private logger = new Logger(ApiKeyGuard.name);
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(ApiKeyService)
    private apiKeyService: ApiKeyService,
    @Inject(UsersService)
    private userService: UsersService,
    @Inject(TenantMembershipService)
    private tenantMembershipService: TenantMembershipService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = this.extractTokenFromHeader(request);
    if (!key || key.length <= 0) return true;
    if (key === process.env?.[ENV_MASTER_KEY]) {
      request.isMasterRequest = true;
      return true;
    }
    try {
      const exists = await this.apiKeyService?.get({
        req: request,
        where: { key },
        relations: { user: true },
      });
      if (!exists || !exists.isActive) {
        throw new UnauthorizedException('API key is inactive');
      }
      const user = await this.userService.get({
        where: { id: exists?.user?.id },
        relations: { role: true },
      });

      if (exists && exists.key === key) {
        request.isApiKeyAuthenticated = true;
        this.logger.verbose(`api key user is ${user?.email}`);
        request.user = user;
        request.loggedInUser = user;
        const tenantId = user?.tenant?.id ?? user?.id;
        request.tenant = tenantId ? { id: tenantId } : user;
        const membership = tenantId && user?.id ? await this.tenantMembershipService.getMembership(Number(tenantId), Number(user.id)) : null;
        request.tenantRole = membership?.role?.name?.toLowerCase?.() ?? null;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        this.logger.error(e);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.get('x-api-key');
  }
}
