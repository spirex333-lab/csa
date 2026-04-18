import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { ChangeNowController } from './change-now.controller';
import { ChangeNowService } from './change-now.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeNow])],
  controllers: [ChangeNowController],
  providers: [ChangeNowService],
  exports: [ChangeNowService],
})
export class ChangeNowModule {}
