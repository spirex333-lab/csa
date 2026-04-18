import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CRUDService,
  CRUDServiceCreateOpts,
  CRUDServiceUpdateOpts,
} from '@workspace/be-commons';
import { Repository } from 'typeorm';
import { ApiKeyExistsException } from './api-key-exists.exception';
import { ApiKey } from '@workspace/be-commons/entities/api-key.entity';
import { ApiKeyDTO } from '@workspace/commons/dtos/api-keys/api-key.dto';
@Injectable()
export class ApiKeyService extends CRUDService<ApiKeyDTO> {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>
  ) {
    super(apiKeyRepository);
  }

  public override async create({ req, dto }: CRUDServiceCreateOpts<ApiKeyDTO>) {
    const exists = await super.get({
      req,
      where: { name: dto?.name, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
    });
    if (exists) {
      throw new ApiKeyExistsException();
    }

    return super.create({ req, dto });
  }

  public override async update({
    where,
    dto,
    req,
  }: CRUDServiceUpdateOpts<ApiKeyDTO>) {
    if (dto?.key?.length) {
      const newExists = await super.get({
        req,
        where: { key: dto?.key, tenant: { id: (where as any)?.tenant ?? (where as any)?.user } },
      });
      if (newExists) {
        const existing = await super.get({ where, req });
        if (existing && existing.key !== newExists.key)
          throw new ApiKeyExistsException();
      }
    }
    return super.update({ where, dto });
  }
}
