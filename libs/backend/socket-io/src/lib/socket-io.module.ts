import { Module } from '@nestjs/common';
import { SocketIOGateway } from './socket-io.controller';
import { SocketIOService } from './socket-io.service';

@Module({
  controllers: [],
  providers: [SocketIOGateway,SocketIOService],
  exports: [SocketIOService],
})
export class SocketIoModule {}
