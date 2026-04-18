import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IPUALogDTO } from '@workspace/commons/dtos/ipua-logs/ipua-log.dto';
import { Server, Socket } from 'socket.io';
import { SocketIOService } from './socket-io.service';

@WebSocketGateway({
  cors: true,
}) // You can specify options like { namespace: '/chat', cors: true }
export class SocketIOGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private _server!: Server;

  private logger = new Logger(SocketIOGateway.name);

  constructor(@Inject(SocketIOService) private service: SocketIOService) {}

  // Called when the gateway initializes
  afterInit(server: Server) {
    this.logger.verbose('WebSocket Gateway Initialized');
    if (process?.env?.['CORS']) {
      this.logger.verbose('Accepted origins:', process?.env?.['CORS']);
    } else {
      this.logger.verbose('Please add CORS URLs in the env');
    }
    this.service.setSerer(server);
  }

  // Called when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    this.logger.verbose(`Client disconnected: ${client.data?.ip}`);
  }

  // Subscribe to a specific event
  @SubscribeMessage('join')
  async handleMessage(client: Socket, payload: IPUALogDTO) {
    await this.service.join(client, payload);
  }

  // Subscribe to a specific event
  @SubscribeMessage('list')
  async listConnections(client: Socket, payload: { streamUUID: string }) {
    await this.service.listConnections(client, payload?.streamUUID);
  }

  // Subscribe to a specific event
  @SubscribeMessage('evaluate')
  async evaluate(
    client: Socket,
    payload: { visitorId: string; code: string; streamUUID: string }
  ) {
    await this.service.evaluate(client, payload);
  }
}
