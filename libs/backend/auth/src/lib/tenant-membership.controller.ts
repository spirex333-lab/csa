import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Authenticated } from '@workspace/be-commons/decorators/is-authenticated';
import { TenantRoles } from '@workspace/be-commons/decorators/tenant-roles.decorator';
import { AuthGuard } from './auth.guard';
import { AuthenticatedRequest } from './auth.controller';
import { TenantRoleGuard } from './tenant-role.guard';
import { TenantMembershipService } from './tenant-membership.service';
import { TENANT_ROLE, type TenantRoleName } from './tenant-roles.constants';

@Controller('tenant/members')
@Authenticated()
@UseGuards(AuthGuard)
export class TenantMembershipController {
  constructor(private readonly tenantMembershipService: TenantMembershipService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const tenantId = Number(req?.tenant?.id ?? req?.user?.id);
    return this.tenantMembershipService.listByTenant(tenantId);
  }

  @Post()
  @UseGuards(TenantRoleGuard)
  @TenantRoles(TENANT_ROLE.OWNER, TENANT_ROLE.ADMIN)
  async add(
    @Req() req: AuthenticatedRequest,
    @Body() body: { memberId?: number; email?: string; roleId?: number; roleName?: TenantRoleName }
  ) {
    const tenantId = Number(req?.tenant?.id ?? req?.user?.id);
    const actorId = Number(req?.user?.id);
    return this.tenantMembershipService.addMember(tenantId, actorId, body);
  }

  @Patch(':id/role')
  @UseGuards(TenantRoleGuard)
  @TenantRoles(TENANT_ROLE.OWNER, TENANT_ROLE.ADMIN)
  async updateRole(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleId?: number; roleName?: TenantRoleName }
  ) {
    const tenantId = Number(req?.tenant?.id ?? req?.user?.id);
    const actorId = Number(req?.user?.id);
    return this.tenantMembershipService.updateRole(tenantId, actorId, id, body);
  }

  @Delete(':id')
  @UseGuards(TenantRoleGuard)
  @TenantRoles(TENANT_ROLE.OWNER, TENANT_ROLE.ADMIN)
  async remove(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const tenantId = Number(req?.tenant?.id ?? req?.user?.id);
    const actorId = Number(req?.user?.id);
    return this.tenantMembershipService.removeMember(tenantId, actorId, id);
  }
}
