import { IsEmail, IsNotEmpty, Matches, ValidateIf } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class CreateUserDTO extends BaseDTO<typeof CreateUserDTO> {
  @IsEmail({ require_tld: true }, { message: 'Please provide a valid email' })
  public email!: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]}\\|;:'",<.>/?]).{8,}$/,
    {
      message: 'Please provide a valid password',
    }
  )
  public password!: string;

  @ValidateIf((object, value) => value && value !== '')
  @IsNotEmpty({})
  public firstName?: string;
}
