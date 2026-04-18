import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from '@workspace/be-commons/entities/config.entity'
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigController],
  providers: [ConfigService],  
  exports: [ConfigService],
})
export class ConfigModule { }
