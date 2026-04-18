import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { QuoteRequestDto, QuoteResponseDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto, RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import { OrderDto, OrderStatus, OrderStatusDto } from '@workspace/commons/dtos/change-now/order.dto';

const BASE_URL = 'https://api.changenow.io/v2';
const MAX_RETRIES = 3;

@Injectable()
export class ChangeNowService {
  private readonly logger = new Logger(ChangeNowService.name);
  private readonly apiKey: string;

  constructor(
    @InjectRepository(ChangeNow)
    private readonly orderRepo: Repository<ChangeNow>
  ) {
    this.apiKey = process.env['CHANGENOW_API_KEY'] ?? '';
  }

  async getCurrencies(): Promise<CurrencyDto[]> {
    const data = await this.get<any[]>('/exchange/currencies', {  flow: 'standard' });
    return data.map((c) => ({
      ticker: c.ticker,
      name: c.name,
      network: c.network ?? c.ticker,
      logoUrl: c.image ?? '',
      minAmount: c.minAmount ?? 0,
      maxAmount: c.maxAmount ?? 0,
      isActive: true,
    }));
  }

  async getFloatQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const data = await this.get<any>('/exchange/estimated-amount', {
      fromCurrency: req.fromCurrency,
      toCurrency: req.toCurrency,
      fromAmount: req.fromAmount,
      fromNetwork: req.fromNetwork,
      toNetwork: req.toNetwork,
      flow: 'standard',
    });
    return {
      fromAmount: req.fromAmount,
      toAmount: data.estimatedAmount,
      provider: 'changenow',
    };
  }

  async getFixedQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const data = await this.get<any>('/exchange/estimated-amount', {
      fromCurrency: req.fromCurrency,
      toCurrency: req.toCurrency,
      fromAmount: req.fromAmount,
      fromNetwork: req.fromNetwork,
      toNetwork: req.toNetwork,
      flow: 'fixed-rate',
    });
    return {
      fromAmount: req.fromAmount,
      toAmount: data.estimatedAmount,
      rateId: data.rateId,
      validUntil: data.validUntil,
      provider: 'changenow',
    };
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderDto> {
    const body: Record<string, unknown> = {
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.fromAmount,
      address: dto.toAddress,
      flow: dto.rateType === RateType.FIXED ? 'fixed-rate' : 'standard',
      ...(dto.fromNetwork && { fromNetwork: dto.fromNetwork }),
      ...(dto.toNetwork && { toNetwork: dto.toNetwork }),
      ...(dto.rateId && { rateId: dto.rateId }),
    };

    const data = await this.post<any>('/exchange', body);

    const order = this.orderRepo.create({
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.fromAmount,
      expectedToAmount: data.toAmount,
      depositAddress: data.payinAddress,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      externalId: data.id,
    });
    await this.orderRepo.save(order);

    return {
      id: data.id,
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.fromAmount,
      expectedToAmount: data.toAmount,
      depositAddress: data.payinAddress,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      createdAt: new Date().toISOString(),
    };
  }

  async getOrderStatus(externalId: string): Promise<OrderStatusDto> {
    const data = await this.get<any>(`/exchange/by-id`, { id: externalId });

    await this.orderRepo.update({ externalId }, { status: data.status });

    return {
      id: externalId,
      status: data.status,
      fromAmount: data.fromAmount,
      toAmount: data.toAmount,
      depositAddress: data.payinAddress,
      updatedAt: new Date().toISOString(),
    };
  }

  private async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  private async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    opts: { params?: Record<string, unknown>; body?: Record<string, unknown> },
    attempt = 1
  ): Promise<T> {
    const headers: Record<string, string> = {
      'x-changenow-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    let url = `${BASE_URL}${path}`;
    if (method === 'GET' && opts.params) {
      const qs = new URLSearchParams(
        Object.entries(opts.params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      ).toString();
      if (qs) url += `?${qs}`;
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        ...(method === 'POST' && { body: JSON.stringify(opts.body) }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const status = res.status;
        if ((status === 429 || status >= 500) && attempt < MAX_RETRIES) {
          const delay = 2 ** attempt * 300;
          this.logger.warn(`ChangeNow ${method} ${path} failed (${status}), retry ${attempt} in ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          return this.request<T>(method, path, opts, attempt + 1);
        }
        throw new HttpException((errBody as any)?.message ?? 'ChangeNow API error', status);
      }

      return res.json() as Promise<T>;
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('ChangeNow API unreachable', 502);
    }
  }
}
