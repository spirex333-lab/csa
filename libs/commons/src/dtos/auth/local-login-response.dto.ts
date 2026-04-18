import { UserDTO } from './user.dto';

export class LocalLoginResponseDTO {
  public token?: string;
  public user?: Partial<UserDTO>;
}
