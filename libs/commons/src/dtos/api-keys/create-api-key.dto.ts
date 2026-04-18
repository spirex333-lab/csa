import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class CreateApiKeyDTO extends BaseDTO<CreateApiKeyDTO> {
  @IsNotEmpty()
  public name!: string;
}
