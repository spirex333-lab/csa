import { IPUALogIPInfoDTO } from '@workspace/commons/dtos/ipua-logs/ip-info.dto';
import { IPUALogRequstHeadersDTO } from '@workspace/commons/dtos/ipua-logs/request-headers.dto';
import { IPUALogServerDTO } from '@workspace/commons/dtos/ipua-logs/server.dto';
import { IPUALogUserAgentDTO } from '@workspace/commons/dtos/ipua-logs/user-agent.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class IPUALog extends BaseEntity<IPUALog> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  streamUUID!: string;

  @Column({ type: 'json' })
  requestHeaders!: IPUALogRequstHeadersDTO;

  @Column({ type: 'json' })
  server!: IPUALogServerDTO;

  @Column({ type: 'json' })
  ua!: IPUALogUserAgentDTO;

  @Column({ type: 'json', nullable: true })
  ipInfo!: IPUALogIPInfoDTO;

  @Column()
  ip!: string;

  @Column({ nullable: true })
  mode!: string;
  
  @Column({ default:0.0, type:"float" })
  filterScore!: number;
}
