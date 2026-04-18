import { Controller, Inject } from '@nestjs/common';
import { CRUDController } from '@workspace/be-commons';
import { CreateUserDTO } from '@workspace/commons/dtos/auth/create-user.dto';
import { UpdateUserDTO } from '@workspace/commons/dtos/auth/update-user.dto';
import { UsersService } from './user.service';
@Controller('users')
export class UsersController extends CRUDController<CreateUserDTO> {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {
    super(usersService, CreateUserDTO as any, UpdateUserDTO as any);
  }
}
