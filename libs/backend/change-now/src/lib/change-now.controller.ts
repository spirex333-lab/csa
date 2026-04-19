import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChangeNowService } from './change-now.service';
import { QuoteRequestDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto } from '@workspace/commons/dtos/change-now/create-order.dto';
import { Public } from '@workspace/be-commons/decorators/is-public.decorator';
@Controller('change-now')
export class ChangeNowController {
  constructor(private readonly changeNowService: ChangeNowService) {}

  @Public()
  @Get('currencies')
  getCurrencies() {
    return this.changeNowService.getCurrencies();
  }
  @Public()
  @Get('quote/float')
  getFloatQuote(@Query() query: QuoteRequestDto) {
    return this.changeNowService.getFloatQuote(query);
  }
  @Public()
  @Get('quote/fixed')
  getFixedQuote(@Query() query: QuoteRequestDto) {
    return this.changeNowService.getFixedQuote(query);
  }
  @Public()
  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.changeNowService.createOrder(dto);
  }
  @Public()
  @Get('orders/:id')
  getOrderStatus(@Param('id') id: string) {
    return this.changeNowService.getOrderStatus(id);
  }
}
