import { IPUALogDTO } from '../../dtos/ipua-logs/ipua-log.dto';
import { io, Socket } from 'socket.io-client';

export type ConnectOptions = {
  user?: any;
  ip?: any;
  ua?: any;
  fingerprint?: any;
  uuid?: string;
  params?: any;
  id?: string;
};
export type SocketIOConstructorOptions = {
  url?: string;
};

export type EventListener = {
  id: string;
  type?: string;
  cb?: (data?: any) => void;
};

export class SocketIO {
  public socket!: Socket;
  public connected = false;
  public joined = false;
  constructor(opts?: SocketIOConstructorOptions) {
    const { url = 'http://localhost:4000' } = opts ?? {};
    if (typeof window !== 'undefined') {
      this.socket = io(url);
      console.log('WS Connecting');
      this.on('connect', this.handleConnection.bind(this));
      this.on('disconnect', this.handleDisonnection.bind(this));
    }
  }

  handleConnection(data: any) {
    console.log('WS connected');
    this.connected = true;
  }
  handleDisonnection(data: any) {
    console.log('WS disconnected');
    this.connected = false;
    this.joined = false;
  }

  join(opts: Partial<IPUALogDTO>):Socket {
    console.log('joining', this.socket, this.connected, opts);
    if (this.socket && !this.joined) {
      this.send('join', opts);
      this.handleReset(opts);
    }
    return this.socket;
  }
  send(type: string, data: any) {
    this.socket?.emit(type, data);
  }
  on(type: string, cb?: (data?: any) => void) {
    if (cb) {
      this.socket.on(type, cb);
    }
  }
  off(type: string, cb?: (data?: any) => void) {
    if (cb) {
      this.socket.off(type, cb);
    }
  }

  private handleReset(opts: ConnectOptions) {
    // this.socket.io.on("close", () => this.join(opts))
  }
}
