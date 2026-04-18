import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MatchPassword } from '../../validation/matching-passwords';
import { BaseDTO } from '../base.dto';

export class LocalRegisterDTO extends BaseDTO<typeof LocalRegisterDTO> {
  @IsEmail({ require_tld: true }, { message: 'Please provide a valid email' })
  public email!: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]}\\|;:'",<.>/?]).{8,}$/,
    {
      message: 'Please provide a valid password',
    }
  )
  public password!: string;

  @MatchPassword('password', { message: 'Passwords do not match' })
  public rePassword!: string;

  @IsNotEmpty()
  public firstName!: string;
  
  public lastName!: string;
}
