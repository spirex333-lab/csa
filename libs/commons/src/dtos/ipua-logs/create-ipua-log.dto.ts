import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../base.dto';
import { IPUALogIPInfoDTO } from './ip-info.dto';
import { IPUALogRequstHeadersDTO } from './request-headers.dto';
import { IPUALogServerDTO } from './server.dto';
import { IPUALogUserAgentDTO } from './user-agent.dto';

export class CreateIPUALogDTO extends BaseDTO<CreateIPUALogDTO> {
  @IsNotEmpty()
  public streamUUID!: string;

  @IsNotEmpty()
  public requestHeaders!: IPUALogRequstHeadersDTO;

  @IsNotEmpty()
  public server!: IPUALogServerDTO;

  @IsNotEmpty()
  public ua!: IPUALogUserAgentDTO;

  @IsNotEmpty()
  public ipInfo!: IPUALogIPInfoDTO;

  @IsNotEmpty()
  public ip!: string;

  public mode?: string;

  public filterScore?: number;
}
