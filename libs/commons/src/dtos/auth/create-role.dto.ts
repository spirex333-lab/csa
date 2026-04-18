import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class CreateRoleDTO extends BaseDTO<typeof CreateRoleDTO> {
  @IsNotEmpty({})
  public name?: string;
  public isAdmin?: boolean;
  public isPublic?: boolean;
}
