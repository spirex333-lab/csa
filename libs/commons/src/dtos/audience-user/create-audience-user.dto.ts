import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { AudienceListDTO } from '../audience/list.dto';

export class CreateAudienceUserDTO extends BaseDTO<
  typeof CreateAudienceUserDTO
> {
  @IsNotEmpty({ message: 'Please provide a valid email' })
  public email!: string;

  @IsNotEmpty({ message: 'Please provide valid data' })
  public data!: Record<string, unknown>;
  
  @IsNotEmpty({ message: 'Please provide a valid audience list' })
  public audienceList!: AudienceListDTO;
}
