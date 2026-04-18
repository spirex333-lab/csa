import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class CreateMailTemplateDTO extends BaseDTO<typeof CreateMailTemplateDTO> {
  @IsNotEmpty({ message: 'Please provide a valid name' })
  public name!: string;
}
