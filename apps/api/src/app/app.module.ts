import { Module } from '@nestjs/common';

import { AuthModule } from '@workspace/auth';
import { ChangeNowModule } from '@workspace/change-now';
import { ConfigModule } from '@workspace/config';
import { FfioModule } from '@workspace/ffio';
import { FilesModule } from '@workspace/files-api/lib/files.module';
import { IPUALogModule } from '@workspace/ipualog';
import { MysqlDbModule } from '@workspace/mysql-db';
import { SocketIoModule } from '@workspace/socket-io';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MysqlDbModule,
    ChangeNowModule,
    FfioModule,
    ConfigModule,
    SocketIoModule,
    FilesModule,
    AuthModule,
    IPUALogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
