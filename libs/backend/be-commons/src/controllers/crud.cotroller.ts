import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { Request } from 'express';
import { validateDTO } from '@workspace/commons/validation';
import { HttpValidationException } from '../exceptions';
import { CRUDService } from '../services/crud.service';
export type AuthenticatedRequest<U = any> = Request & {
  user?: U;
  tenant?: U;
  tenantRole?: string | null;
  apiKeyUser?: U;
};

export class CRUDController<D extends Partial<any> = any, S = any> {
  constructor(
    private readonly service: S & CRUDService,
    private createDTO?: D,
    private updateDTO?: D
  ) {}

  @Get('/')
  public async list(
    @Req() req: AuthenticatedRequest,
    @Query('where') where: Partial<D> = {},
    @Query('relations') relations: Record<string, boolean> = {},
    @Query('skip') skip = '0',
    @Query('take') take = '10',
    @Query('order')
    order: { [k: string]: 'ASC' | 'DESC' } = { createdAt: 'DESC' }
  ) {
    const tenantId = (req as any)?.tenant?.id ?? req?.user?.id;
    const workspace = ((req.headers['x-workspace'] as string) || where?.['workspace']) as string | undefined;

    const where_ = {
      ...(where ?? {}),
      tenant: { id: where?.['id'] === tenantId ? null : tenantId },
      ...(workspace ? { workspace } : {}),
    };
    const opts = {
      where: where_,
      order,
      relations,
      skip: parseInt(skip),
      take: parseInt(take),
    };
    const total = await this.service.count({ ...(opts ?? {}) });
    const data = await this.service?.list({ ...opts, req });
    return { total, data };
  }

  @Get('/:id')
  public async get(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
    @Query('relations') relations: Record<string, boolean> = {},
    @Query('where') where: Partial<D> = {}
  ) {
    const tenantId = (req as any)?.tenant?.id ?? req?.user?.id;
    const workspace = ((req.headers['x-workspace'] as string) || where?.['workspace']) as string | undefined;

    const resp = await this.service?.get({
      where: {
        ...(where ?? {}),
        id,
        tenant: { id: where?.['id'] === where?.['tenant']?.id ? null : tenantId },
        ...(workspace ? { workspace } : {}),
      },
      relations,
      req,
    });
    return resp;
  }

  @Post('/')
  public async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: D,
    ...args: unknown[]
  ) {
    const errors = await validateDTO(this.createDTO, dto);
    if (errors.length) {
      throw new HttpValidationException(errors, 'Validation failed');
    }
    const tenantId = (req as any)?.tenant?.id ?? req?.user?.id;
    const workspace = (req.headers['x-workspace'] as string) || (dto as any)?.workspace;
    if (tenantId) {
      (dto as any).tenant = { id: tenantId };
    }
    if (workspace) {
      (dto as any).workspace = workspace;
    }
    return await this.service?.create({ req, dto });
  }

  @Put('/:id')
  public async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
    @Body() dto: Partial<D>
  ) {
    const tenantId = (req as any)?.tenant?.id ?? req?.user?.id;
    const workspace = (req.headers['x-workspace'] as string) || (dto as any)?.workspace;
    const where = {
      id,
      tenant: { id: tenantId },
      ...(workspace ? { workspace } : {}),
    };
    const errors = await validateDTO(this.updateDTO, dto);
    if (errors.length) {
      throw new HttpValidationException(errors, 'Validation failed');
    }
    return await this.service?.update({ req, where, dto });
  }

  @Delete('/:id')
  public async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number
  ) {
    const tenantId = (req as any)?.tenant?.id ?? req?.user?.id;
    const workspace = req.headers['x-workspace'] as string | undefined;
    const where = {
      id,
      tenant: { id: id === tenantId ? null : tenantId },
      ...(workspace ? { workspace } : {}),
    };
    return await this.service?.delete({ req, where });
  }
}
