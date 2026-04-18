import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mailbox } from '@workspace/be-commons/entities/mailbox';
import { CRUDService } from '@workspace/be-commons';

@Injectable()
export class MailboxService extends CRUDService {
  constructor(
    @InjectRepository(Mailbox)
    private readonly mailboxRepository: Repository<Mailbox>
  ) {
    super(mailboxRepository);
  }
}
