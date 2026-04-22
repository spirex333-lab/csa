import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@workspace/auth/lib/auth.guard';
import { CreateOrdersDto } from '@workspace/commons/dtos/orders/create-orders.dto';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  create(@Body() dto: CreateOrdersDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get('/:id')
  get(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
