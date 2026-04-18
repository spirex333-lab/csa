import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { HttpValidationException } from '@workspace/be-commons/exceptions';
import { IPUALogDTO } from '@workspace/commons/dtos/ipua-logs/ipua-log.dto';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketIOService {
  @WebSocketServer()
  public server!: Server;

  private logger: Logger = new Logger(SocketIOService.name);

  public setSerer(server: Server) {
    this.server = server;
  }

  /**
   * List all sockets for a stream
   * @param streamUUID
   * @returns
   */
  public async listConnections(client: Socket, streamUUID: string) {
    const conns = await this.server.in(streamUUID).fetchSockets();
    client?.emit(
      'list',
      conns
        ?.filter?.((c) => c.data?.visitorId !== client.data?.visitorId)
        ?.map((c) => c.data)
    );
    return conns;
  }

  /**
   * Join a stream/room
   * @param client
   * @param ipuaLog
   */
  public async join(client: Socket, ipuaLog: IPUALogDTO) {
    if (!ipuaLog.streamUUID) {
      this.logger.verbose('No such visitor/socket ', ipuaLog?.visitorId);
      throw new HttpValidationException([], 'Invalid stream');
    }
    this.logger.log(
      `Client connected : ${ipuaLog?.ip} in room => ${ipuaLog?.streamUUID}`
    );
    client.data = ipuaLog;
    client.join(ipuaLog.streamUUID);
    client.emit('joined');
  }

  /**
   * Evaluate a script
   * @param client
   * @param ipuaLog
   */
  public async evaluate(
    client: Socket,
    payload: { visitorId: string; code: string; streamUUID: string }
  ) {
    const socket = await this.getVisitorSocket(
      payload?.streamUUID,
      payload?.visitorId
    );
    this.logger.verbose('Sending evaluate to ', payload?.visitorId);
    if (!socket) {
      this.logger.verbose('No such visitor/socket ', payload?.visitorId);
      throw new HttpValidationException([], 'Invalid stream/socket');
    }
    socket.emit('evaluate', payload);
  }

  private async getVisitorSocket(streamUUID: string, visitorId: string) {
    const sockets = await this.server.in(streamUUID).fetchSockets();
    return sockets?.find((s) => s.data?.visitorId === visitorId);
  }
}
