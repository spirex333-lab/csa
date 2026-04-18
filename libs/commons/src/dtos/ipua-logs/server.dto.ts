import { BaseDTO } from '../base.dto';

export class IPUALogServerDTO extends BaseDTO<IPUALogServerDTO> {
  public DOCUMENT_ROOT?: string;
  public REMOTE_ADDR?: string;
  public REMOTE_PORT?: string;
  public SERVER_SOFTWARE?: string;
  public SERVER_PROTOCOL?: string;
  public SERVER_NAME?: string;
  public SERVER_PORT?: string;
  public REQUEST_URI?: string;
  public REQUEST_METHOD?: string;
  public SCRIPT_NAME?: string;
  public SCRIPT_FILENAME?: string;
  public PHP_SELF?: string;
  public HTTP_HOST?: string;
  public HTTP_CONNECTION?: string;
  public HTTP_CACHE_CONTROL?: string;
  public HTTP_SEC_CH_UA?: string;
  public HTTP_SEC_CH_UA_MOBILE?: string;
  public HTTP_SEC_CH_UA_PLATFORM?: string;
  public HTTP_UPGRADE_INSECURE_REQUESTS?: string;
  public HTTP_USER_AGENT?: string;
  public HTTP_ACCEPT?: string;
  public HTTP_SEC_FETCH_SITE?: string;
  public HTTP_SEC_FETCH_MODE?: string;
  public HTTP_SEC_FETCH_USER?: string;
  public HTTP_SEC_FETCH_DEST?: string;
  public HTTP_ACCEPT_ENCODING?: string;
  public HTTP_ACCEPT_LANGUAGE?: string;
  public HTTP_COOKIE?: string;
  public REQUEST_TIME_FLOAT?: number;
  public REQUEST_TIME?: number;
}
