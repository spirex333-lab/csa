import { IsEmail, Matches, ValidateIf } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class UpdateUserDTO extends BaseDTO<typeof UpdateUserDTO> {
  @IsEmail({ require_tld: true }, { message: 'Please provide a valid email' })
  public email!: string;

  @ValidateIf((object, value) => value && value !== '')
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]}\\|;:'",<.>/?]).{8,}$/,
    {
      message: 'Please provide a valid password',
    }
  )
  public password?: string;
}
