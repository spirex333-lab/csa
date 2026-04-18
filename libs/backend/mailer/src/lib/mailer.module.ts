import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mailbox } from '@workspace/be-commons/entities/mailbox';
import { MailboxService } from './mailboxes.service';
import { MailboxController } from './mailboxes.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Mailbox])],
  controllers: [MailboxController],
  providers: [MailboxService],
  exports: [MailboxService],
})
export class MailerModule {}
