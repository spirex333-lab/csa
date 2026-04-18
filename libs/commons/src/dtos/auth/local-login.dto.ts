import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class LocalLoginDTO extends BaseDTO<typeof LocalLoginDTO> {
  @IsNotEmpty()
  public identifier!: string;
  @IsNotEmpty()
  public password!: string;
}
