import { CreateIPUALogDTO } from './create-ipua-log.dto';

export class IPUALogDTO extends CreateIPUALogDTO {
  public queryParams!: Record<string, any>;
  public visitorId!: string;
}
