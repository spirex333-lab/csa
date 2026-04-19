import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { FfioModule } from '@workspace/ffio';
import { ChangeNowController } from './change-now.controller';
import { ChangeNowService } from './change-now.service';
import { SwapRouterService } from './swap-router.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeNow]), FfioModule],
  controllers: [ChangeNowController],
  providers: [ChangeNowService, SwapRouterService],
  exports: [ChangeNowService, SwapRouterService],
})
export class ChangeNowModule {}
