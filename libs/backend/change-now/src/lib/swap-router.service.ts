import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { ChangeNowService } from './change-now.service';
import { FfioService } from '@workspace/ffio';
import { QuoteRequestDto, QuoteResponseDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto, RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { OrderDto, OrderStatusDto } from '@workspace/commons/dtos/change-now/order.dto';

@Injectable()
export class SwapRouterService {
  private readonly logger = new Logger(SwapRouterService.name);

  constructor(
    private readonly changeNow: ChangeNowService,
    private readonly ffio: FfioService,
    @InjectRepository(ChangeNow)
    private readonly orderRepo: Repository<ChangeNow>,
  ) {}

  async getCurrencies(): Promise<CurrencyDto[]> {
    return this.changeNow.getCurrencies();
  }

  async getBestFloatQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const [cn, ff] = await Promise.allSettled([
      this.changeNow.getFloatQuote(req),
      this.ffio.getFloatQuote(req),
    ]);
    return this.pickBest(cn, ff, req);
  }

  async getBestFixedQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const [cn, ff] = await Promise.allSettled([
      this.changeNow.getFixedQuote(req),
      this.ffio.getFixedQuote(req),
    ]);
    return this.pickBest(cn, ff, req);
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderDto> {
    const quote = dto.rateType === RateType.FIXED
      ? await this.getBestFixedQuote(dto)
      : await this.getBestFloatQuote(dto);

    if (quote.provider === 'ffio') {
      this.logger.log(`Routing order to ff.io (toAmount: ${quote.toAmount})`);
      return this.ffio.createOrder(dto);
    }
    this.logger.log(`Routing order to ChangeNow (toAmount: ${quote.toAmount})`);
    return this.changeNow.createOrder(dto);
  }

  async getOrderStatus(externalId: string): Promise<OrderStatusDto> {
    const order = await this.orderRepo.findOneOrFail({ where: { externalId } });
    if (order.provider === 'ffio') {
      return this.ffio.getOrderStatus(externalId);
    }
    return this.changeNow.getOrderStatus(externalId);
  }

  private pickBest(
    cn: PromiseSettledResult<QuoteResponseDto>,
    ff: PromiseSettledResult<QuoteResponseDto>,
    req: QuoteRequestDto,
  ): QuoteResponseDto {
    const cnOk = cn.status === 'fulfilled' ? cn.value : null;
    const ffOk = ff.status === 'fulfilled' ? ff.value : null;

    if (!cnOk && !ffOk) {
      throw new Error(`Both providers failed for ${req.fromCurrency}→${req.toCurrency}`);
    }
    if (!cnOk) return ffOk!;
    if (!ffOk) return cnOk;
    return ffOk.toAmount > cnOk.toAmount ? ffOk : cnOk;
  }
}
