import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDTO } from '../base.dto';

export class CreateMailboxDTO extends BaseDTO<typeof CreateMailboxDTO> {
  @IsNotEmpty({ message: 'Please provide a valid name' })
  public name!: string;

  @IsNotEmpty({ message: 'Please provide a valid smtp host' })
  public host!: string;

  @IsNotEmpty({ message: 'Please provide a valid smtp port' })
  public port!: number;

  @IsNotEmpty({ message: 'Please provide a valid mailbox username/email' })
  public username!: string;

  @IsNotEmpty({ message: 'Please provide a password' })
  public password!: string;

  public isActive!: boolean;
}
