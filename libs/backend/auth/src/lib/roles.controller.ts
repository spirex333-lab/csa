/* eslint-disable @nx/enforce-module-boundaries */
import { Controller, Inject } from '@nestjs/common';
import { CRUDController } from '@workspace/be-commons';
import { CreateRoleDTO } from '@workspace/commons/dtos/auth/create-role.dto';
import { UpdateRoleDTO } from '@workspace/commons/dtos/auth/update-role.dto';
import { RolesService } from './roles.service';
@Controller('roles')
export class RolesController extends CRUDController<CreateRoleDTO> {
  constructor(
    @Inject(RolesService)
    private readonly rolesService: RolesService
  ) {
    super(rolesService, CreateRoleDTO as any, UpdateRoleDTO as any);
  }
}
