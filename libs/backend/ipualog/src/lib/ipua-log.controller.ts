import { Controller, Inject } from '@nestjs/common';
import { CRUDController } from '@workspace/be-commons';
import { IPUALogService } from './ipua-log.service';
import { CreateIPUALogDTO } from '@workspace/commons/dtos/ipua-logs/create-ipua-log.dto';
@Controller('ipua-log')
export class IPUALogController extends CRUDController<
  CreateIPUALogDTO,
  IPUALogService
> {
  constructor(
    @Inject(IPUALogService)
    private readonly ipuaLogService: IPUALogService
  ) {
    super(ipuaLogService, CreateIPUALogDTO as any);
  }
}
