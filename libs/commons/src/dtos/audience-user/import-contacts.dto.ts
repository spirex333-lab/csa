import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { AudienceListDTO } from '../audience/list.dto';

export class ImportContactsDTO extends BaseDTO<
  typeof ImportContactsDTO
> {
  
  public csvFilePath!: string;

  @IsNotEmpty({ message: 'Please provide valid data' })
  public audienceList!: AudienceListDTO;
}
