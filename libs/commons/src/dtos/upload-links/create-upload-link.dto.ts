import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { UserDTO } from '../auth/user.dto';

export class CreateUploadLinkDTO extends BaseDTO<CreateUploadLinkDTO> {
  @IsNotEmpty()
  customer!: UserDTO;
}
