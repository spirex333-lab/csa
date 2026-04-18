import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from '@workspace/be-commons';
import { IPUALogDTO } from '@workspace/commons/dtos/ipua-logs/ipua-log.dto';
import { Repository } from 'typeorm';
import { IPUALog } from '@workspace/be-commons/entities/ipua-log.entity';

@Injectable()
export class IPUALogService extends CRUDService<IPUALogDTO> {
  constructor(
    @InjectRepository(IPUALog)
    private readonly ipuaRepository: Repository<IPUALog>
  ) {
    super(ipuaRepository);
  }
}
