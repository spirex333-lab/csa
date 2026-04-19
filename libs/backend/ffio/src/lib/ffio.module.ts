import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { FfioService } from './ffio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeNow])],
  providers: [FfioService],
  exports: [FfioService],
})
export class FfioModule {}
