import { BaseDTO } from '../base.dto';

export class IPUALogRequstHeadersDTO extends BaseDTO<IPUALogRequstHeadersDTO> {
  public Host?: string;
  public Connection?: string;
  public 'Cache-Control'?: string;
  public 'sec-ch-ua'?: string;
  public 'sec-ch-ua-mobile'?: string;
  public 'sec-ch-ua-platform'?: string;
  public 'Upgrade-Insecure-Requests'?: string;
  public 'User-Agent'?: string;
  public Accept?: string;
  public 'Sec-Fetch-Site'?: string;
  public 'Sec-Fetch-Mode'?: string;
  public 'Sec-Fetch-User'?: string;
  public 'Sec-Fetch-Dest'?: string;
  public 'Accept-Encoding'?: string;
  public 'Accept-Language'?: string;
  public Cookie?: string;
}
