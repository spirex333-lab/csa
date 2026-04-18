import { BaseDTO } from '../base.dto';
export class SocketIOMessagePayload<T> extends BaseDTO<
  SocketIOMessagePayload<T>
> {
  data?: T;
  message?: string;
  action?: string;
}
