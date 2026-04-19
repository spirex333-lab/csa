import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SwapRouterService } from './swap-router.service';
import { QuoteRequestDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto } from '@workspace/commons/dtos/change-now/create-order.dto';
import { Public } from '@workspace/be-commons/decorators/is-public.decorator';

@Controller('change-now')
export class ChangeNowController {
  constructor(private readonly swapRouter: SwapRouterService) {}

  @Public()
  @Get('currencies')
  getCurrencies() {
    return this.swapRouter.getCurrencies();
  }

  @Public()
  @Get('quote/float')
  getFloatQuote(@Query() query: QuoteRequestDto) {
    return this.swapRouter.getBestFloatQuote(query);
  }

  @Public()
  @Get('quote/fixed')
  getFixedQuote(@Query() query: QuoteRequestDto) {
    return this.swapRouter.getBestFixedQuote(query);
  }

  @Public()
  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.swapRouter.createOrder(dto);
  }

  @Public()
  @Get('orders/:id')
  getOrderStatus(@Param('id') id: string) {
    return this.swapRouter.getOrderStatus(id);
  }
}
