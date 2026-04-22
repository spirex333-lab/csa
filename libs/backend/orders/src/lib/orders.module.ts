import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@workspace/auth';
import { ChangeNowModule } from '@workspace/change-now';
import { Orders } from '@workspace/be-commons/entities/orders.entity';
import { OrderEvent } from '@workspace/be-commons/entities/order-event.entity';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, OrderEvent, ChangeNow]),
    AuthModule,
    ChangeNowModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
