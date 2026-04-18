import { BaseDTO } from '../base.dto';

export class IPUALogUserAgentDTO extends BaseDTO<IPUALogUserAgentDTO> {
  public browser?: { name?: string; version?: string; major?: string };
  public device?: { vendor?: string; model?: string };
  public platform?: { name?: string; version?: string };
}
