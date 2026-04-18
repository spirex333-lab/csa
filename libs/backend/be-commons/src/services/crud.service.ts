import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { AuthenticatedRequest } from '../controllers';

export type CRUDServiceOpts<U = any> = {
  req?: AuthenticatedRequest<U>;
};

export type CRUDServiceCreateOpts<E, U = any> = CRUDServiceOpts<U> & {
  dto: Partial<E>;
};
export type CRUDServiceUpsertOpts<E, U = any> = CRUDServiceOpts<U> & {
  dtos: Partial<E>[];
};
export type CRUDServiceListOpts<E, U = any> = CRUDServiceOpts<U> &
  FindManyOptions<E> & {};
export type CRUDServiceGetOpts<E, U = any> = CRUDServiceOpts<U> &
  FindOneOptions<E> & {};
export type CRUDServiceUpdateOpts<E, U = any> = CRUDServiceOpts<U> & {
  where: FindOptionsWhere<E>;
  dto: Partial<E>;
};

export type CRUDServiceDeleteOpts<E, U = any> = CRUDServiceOpts<U> & {
  where: FindOptionsWhere<E>;
};
export class CRUDService<E = any, R = Repository<any>> {
  constructor(private readonly repo: R) {}

  /**
   * saves entry to db
   * @param dto
   * @returns
   */
  public async create({ req, dto }: CRUDServiceCreateOpts<E>) {
    return await (this.repo as any)?.save(dto);
  }

  /**
   * saves entries to db
   * @param dto
   * @returns
   */
  public async upsert({ req, dtos }: CRUDServiceUpsertOpts<E>) {
    return await (this.repo as any)?.upsert(dtos);
  }

  /**
   * Count number of entities
   * @param param0
   * @returns
   */
  public async count({ req, ...opts }: CRUDServiceListOpts<E>) {
    return await (this.repo as any)?.count(opts);
  }

  /**
   * List all entries
   * @returns
   */
  public async list({ req, ...opts }: CRUDServiceListOpts<E>) {
    const opts_ = {
      ...(opts ?? {}),
      relations: { ...(opts?.relations ?? {}), tenant: true },
    };
    const { where } = opts ?? {};
    const where_ = this.transformWhereOperators(where);
    let resp = await (this.repo as any)?.find({ ...opts_, where: where_ });

    if (resp.length) {
      resp = resp.map((d: any) => ({
        ...(d ?? {}),
        ...((d?.tenant?.id ? { tenant: { ...d?.tenant, password: undefined } } : {})),
        password: undefined,
      }));
    }
    return resp;
  }

  /**
   * Get entry
   * @param where
   * @returns
   */
  public async get({ req, ...opts }: CRUDServiceGetOpts<E>): Promise<E> {
    const query = {
      ...(opts ?? {}),
      relations: { ...(opts?.relations ?? {}), tenant: true },
    };
    const result = await (this.repo as any)?.findOne(query);
    if (result?.password) {
      result.password = undefined;
    }
    if (result?.tenant) {
      result.tenant = { ...(result.tenant ?? {}), password: undefined };
    }
    return result;
  }

  /**
   * update entry
   * @param dto
   * @returns
   */
  public async update({ where, dto }: CRUDServiceUpdateOpts<E>) {
    return await (this.repo as any)?.update(where, dto);
  }

  /**
   * remove entry
   * @param where
   * @returns
   */
  public async delete({ req, where }: CRUDServiceDeleteOpts<E>) {
    return await (this.repo as any)?.delete(where);
  }

  private readonly transformWhereOperators = (where: any) => {
    for (const key in where ?? {}) {
      // like operator
      if (typeof where[key] === 'object') {
        const like = Object?.keys(where[key])?.find(
          (k) => k?.toLowerCase?.() === 'like'
        );
        if (like) {
          where[key] = Like(`%${where[key][like]}%`);
        }
      }
    }
    return where;
  };
}
