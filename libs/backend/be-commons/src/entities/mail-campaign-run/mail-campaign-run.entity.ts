import { MailCampaignRunStatus } from '@workspace/commons/dtos/mail-campaign-run/mail-campaign-run-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '..';
import { MailCampaign } from '../mail-campaign.entity';
import { AudienceList } from '../audience-list';
import { AudienceUser } from '../audience-user/audience-user.entity';
@Entity()
export class MailCampaignRun extends BaseEntity<MailCampaignRun> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512 })
  name!: string;

  @Column({ enum: MailCampaignRunStatus, type: 'enum' })
  status!: MailCampaignRunStatus;

  @Column({ type: 'jsonb' })
  audienceList!: AudienceList;

  @Column({ type: 'jsonb' })
  lastProcessedAudienceUser!: AudienceUser;

  @ManyToMany(() => MailCampaign)
  @JoinColumn()
  mailCampaign!: MailCampaign;
}
