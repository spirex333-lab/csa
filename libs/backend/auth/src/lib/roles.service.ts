/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CRUDService,
  CRUDServiceCreateOpts,
  CRUDServiceUpdateOpts,
} from '@workspace/be-commons';
import { Role } from '@workspace/be-commons//entities/role.entity';
import { Repository } from 'typeorm';
import { RoleExistsException } from './role-exists.exception';
@Injectable()
export class RolesService extends CRUDService<Role, Repository<Role>> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {
    super(roleRepository);
  }

  public override async create({
    dto,
    req,
  }: CRUDServiceCreateOpts<Role, Partial<Role>>) {
    const exists = await super.get({
      where: { name: dto.name, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
    });
    if (exists?.id) {
      throw new RoleExistsException();
    }
    return await super.create({ dto, req });
  }
  public override async update({
    dto,
    where,
    req,
  }: CRUDServiceUpdateOpts<Role, Partial<Role>>) {
    const exists = await super.get({
      req,
      where: { id: where?.id, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
    });
    if (exists.id && exists.name !== dto?.name) {
      const newExists = await super.get({
        req,
        where: { name: dto?.name, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
      });
      if (newExists.id) throw new RoleExistsException();
    }
    return await super.update({ where, dto, req });
  }
}
