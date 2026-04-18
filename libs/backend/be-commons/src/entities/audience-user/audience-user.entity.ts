import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '..';
import { AudienceList } from '../audience-list';
@Entity()
export class AudienceUser extends BaseEntity<AudienceUser> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 512 })
  email!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    transformer: {
      to: (data: any) => {
        return typeof data === 'string' ? data : JSON.stringify(data); // Convert data to string before storing
      },

      from: (data: string) => {
        return typeof data === 'string' ? JSON.parse(data) : data; // Convert string back to object on retrieval
      },
    },
  })
  @Index('gin')
  data!: Record<string, unknown>;

  @ManyToOne(() => AudienceList)
  @JoinColumn()
  audienceList!: AudienceList;
}
