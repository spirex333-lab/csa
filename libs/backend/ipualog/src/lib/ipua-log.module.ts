import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IPUALogController } from './ipua-log.controller';
import { IPUALog } from '@workspace/be-commons/entities/ipua-log.entity';
import { IPUALogService } from './ipua-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([IPUALog])],
  controllers: [IPUALogController],
  providers: [IPUALogService],
  exports: [IPUALogService],
})
export class IPUALogModule { }
