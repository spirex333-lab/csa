import { Controller, Inject } from '@nestjs/common';
import { CRUDController } from '@workspace/be-commons';
import { CreateMailboxDTO } from '@workspace/commons/dtos/mailer/create-mailbox.dto';
import { MailboxDTO } from '@workspace/commons/dtos/mailer/mailbox.dto';
import { UpdateMailboxDTO } from '@workspace/commons/dtos/mailer/update-mailbox.dto';
import { MailboxService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxController extends CRUDController<MailboxDTO> {
  constructor(
    @Inject(MailboxService)
    private readonly mailboxService: MailboxService
  ) {
    super(mailboxService, CreateMailboxDTO as any, UpdateMailboxDTO as any);
  }
}
