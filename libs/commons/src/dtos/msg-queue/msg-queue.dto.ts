import { CreateMsgQueueDto } from './create-msg-queue.dto';

export class MsgQueueDto extends CreateMsgQueueDto {
  id!: string;
}
