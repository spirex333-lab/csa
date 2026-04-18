import { FileDTO } from '../files/file.dto';
import { RoleDTO } from './role.dto';
import { UpdateUserDTO } from './update-user.dto';

export class UserDTO extends UpdateUserDTO {
  public firstName!: string;
  public lastName!: string;
  public isActive!: string;
  public blocked!: string;
  public avatar!: FileDTO;
  public isEmailVerified!: boolean;
  public role!: RoleDTO;
  public matrixUserId!: string;
}
