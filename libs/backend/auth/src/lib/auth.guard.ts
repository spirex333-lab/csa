import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '@workspace/be-commons/constants';
import { Request } from 'express';
import { UsersService } from './user.service';
import { TenantMembershipService } from './tenant-membership.service';
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly tenantMembershipService: TenantMembershipService,
    private readonly reflector?: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // if already authenticated by api key, then skip
    const isPublic = this.reflector?.get<boolean>(
      'isPublic',
      context.getHandler()
    );
    const isAuthenticated = this.reflector?.get<boolean>(
      'isAuthenticated',
      context.getHandler()
    );
    if (isPublic) {
      this.logger.verbose("Public API hit", (request as Request).method, (request as Request).path);
      return true;
    }
    // check for master request
    if (request.isMasterRequest) {
      this.logger.verbose("Master request hit", (request as Request).method, (request as Request).path);
      return true;
    }
    
    if (request.isApiKeyAuthenticated) {
      this.logger.verbose("API Key request hit", (request as Request).method, (request as Request).path);
      if (isAuthenticated && !request['tenant']) {
        throw new UnauthorizedException('Missing tenant context');
      }
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid session token');
    }
    try {
      const { token: backendToken, payload } = await this.resolveBackendToken(token);
      const user = await this.userService.get({
        where: { id: payload?.["id"] } as any,
        relations: { role: true },
      });
      if (!request.isApiKeyAuthenticated) {
        const { isAdmin } = user?.role ?? {};
        if (!isAdmin && !isAuthenticated && !backendToken) {
          throw new UnauthorizedException();
        }
        request['user'] = user;
      }
      this.logger.verbose(`Auth token user  ${user?.email}`);
      this.logger.verbose(`API path  ${(request as Request).path}`);
      const tenantId = user?.tenant?.id ?? user?.id;
      request['loggedInUser'] = user;
      request['tenant'] = tenantId ? { id: tenantId } : user;
      const membership = tenantId && user?.id
        ? await this.tenantMembershipService.getMembership(Number(tenantId), Number(user.id))
        : null;
      request['tenantRole'] = membership?.role?.name?.toLowerCase?.() ?? null;
    } catch {
      this.logger.warn(`Unauthorized access`,(request as Request).path);
      throw new UnauthorizedException();
    }

    if (isAuthenticated && !request['tenant']) {
      throw new UnauthorizedException('Missing tenant context');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // this.logger.log("Auth Header Type: "+ JSON.stringify(request.headers.authorization));
    return type === 'Bearer' ? token : undefined;
  }

  private async resolveBackendToken(
    token: string
  ): Promise<{ token: string; payload: Record<string, unknown> }> {
    const backendSecret = process.env['JWT_SECRET'] ?? JWT_SECRET;
    try {
      const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(
        token,
        {
          secret: backendSecret,
        }
      );
      return { token, payload };
    } catch (error) {
      const socialToken = await this.extractTokenFromSocialBearer(token);
      if (!socialToken) {
        throw error;
      }

      const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(
        socialToken,
        {
          secret: backendSecret,
        }
      );
      this.logger.verbose('Resolved backend token via social bearer');
      return { token: socialToken, payload };
    }
  }

  private async extractTokenFromSocialBearer(
    token: string
  ): Promise<string | undefined> {
    const nextAuthSecret = process.env['NEXTAUTH_SECRET'] ?? 'dummy-nextauth-secret';
    if (!nextAuthSecret) {
      return undefined;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ backendToken?: string }>(
        token,
        {
          secret: nextAuthSecret,
        }
      );

      if (payload?.backendToken && typeof payload.backendToken === 'string') {
        return payload.backendToken;
      }
    } catch (error) {
      this.logger.debug(
        `Failed to resolve social bearer token: ${
          error instanceof Error ? error.message : 'unknown error'
        }`
      );
    }

    return undefined;
  }
}
