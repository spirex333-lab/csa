import {
  Inject,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CRUDService,
  CRUDServiceCreateOpts,
  CRUDServiceUpdateOpts,
  generateHash,
} from '@workspace/be-commons';
import { User } from '@workspace/be-commons/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { RolesService } from './roles.service';
import { UserExistsException } from './user-exists.exception';
@Injectable()
export class UsersService extends CRUDService<User, Repository<User>> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(RolesService)
    private readonly roleService: RolesService,
  ) {
    super(userRepository);
  }

  public override async create({
    dto,
    req,
  }: CRUDServiceCreateOpts<User, Partial<User>>) {
    if (dto.password?.length) {
      dto.password = generateHash(dto.password);
    }else {
      dto.password = generateHash(v4());

    }
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists?.id) {
      throw new UserExistsException();
    }
    
    const created: User = await super.create({ dto, req });
    
    if(created?.id){
      (req as any).user = created;
      const role = await this.roleService.create({dto:{
        name:"Admin",
        isAdmin: true,
        isPublic:false,
      },req})
      created.role = { id: role?.id };
      this.userRepository.save(created);
    }
    return created;
  }
  public override async update({
    dto,
    where,
    req,
  }: CRUDServiceUpdateOpts<User, Partial<User>>) {
    const exists = await super.get({
      req,
      where: { id: where?.id, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
    });
    if (exists.id && exists.email !== dto?.email) {
      const newExists = await super.get({
        req,
        where: { email: dto?.email, tenant: { id: (req as any)?.tenant?.id ?? req?.user?.id } },
      });
      if (newExists.id) throw new UserExistsException();
    }
    if (dto.password?.length) {
      dto.password = generateHash(dto.password);
    }
    return await super.update({ where, dto, req });
  }
}
