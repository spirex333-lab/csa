import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { QuoteRequestDto, QuoteResponseDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto, RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import { OrderDto, OrderStatus, OrderStatusDto } from '@workspace/commons/dtos/change-now/order.dto';
import { CURRENCY_MAP, SUPPORTED_TICKERS } from '@workspace/commons/currency-map';

const BASE_URL = 'https://api.changenow.io';
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

  getCurrencies(): CurrencyDto[] {
    return SUPPORTED_TICKERS.map((canonical) => ({
      canonicalTicker: canonical,
      label: CURRENCY_MAP[canonical].label,
      image: CURRENCY_MAP[canonical].image,
      network: CURRENCY_MAP[canonical].network,
      buy: true,
      sell: true,
    }));
  }

  async getFloatQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const { ticker: fromCurrency, network: fromNetwork } = this.toCnCode(req.fromCanonical);
    const { ticker: toCurrency, network: toNetwork } = this.toCnCode(req.toCanonical);
    const data = await this.get<{ toAmount: number }>('/v2/exchange/estimated-amount', {
      fromCurrency,
      toCurrency,
      fromAmount: req.fromAmount,
      ...(fromNetwork && { fromNetwork }),
      ...(toNetwork && { toNetwork }),
      flow: 'standard',
    });
    return {
      fromAmount: req.fromAmount,
      toAmount: data.toAmount,
      provider: 'changenow',
    };
  }

  async getFixedQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const { ticker: fromCurrency, network: fromNetwork } = this.toCnCode(req.fromCanonical);
    const { ticker: toCurrency, network: toNetwork } = this.toCnCode(req.toCanonical);
    const data = await this.get<{ toAmount: number; rateId?: string; validUntil?: string }>('/v2/exchange/estimated-amount', {
      fromCurrency,
      toCurrency,
      fromAmount: req.fromAmount,
      ...(fromNetwork && { fromNetwork }),
      ...(toNetwork && { toNetwork }),
      flow: 'fixed-rate',
      useRateId: 'true',
    });
    return {
      fromAmount: req.fromAmount,
      toAmount: data.toAmount,
      rateId: data.rateId,
      validUntil: data.validUntil,
      provider: 'changenow',
    };
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderDto> {
    const { ticker: fromCurrency, network: fromNetwork } = this.toCnCode(dto.fromCanonical);
    const { ticker: toCurrency, network: toNetwork } = this.toCnCode(dto.toCanonical);
    type CreateResponse = { id: string; payinAddress: string; payoutAddress: string };
    let data: CreateResponse;

    if (dto.rateType === RateType.FIXED) {
      data = await this.post<CreateResponse>(`/v1/transactions/fixed-rate/${this.apiKey}`, {
        from: fromCurrency,
        to: toCurrency,
        address: dto.toAddress,
        amount: String(dto.fromAmount),
        ...(dto.rateId && { rateId: dto.rateId }),
      });
    } else {
      data = await this.post<CreateResponse>('/v2/exchange', {
        fromCurrency,
        toCurrency,
        fromAmount: dto.fromAmount,
        address: dto.toAddress,
        flow: 'standard',
        ...(fromNetwork && { fromNetwork }),
        ...(toNetwork && { toNetwork }),
      });
    }

    const order = this.orderRepo.create({
      fromCurrency: dto.fromCanonical,
      toCurrency: dto.toCanonical,
      fromAmount: dto.fromAmount,
      depositAddress: data.payinAddress,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      externalId: data.id,
    });
    await this.orderRepo.save(order);

    return {
      id: data.id,
      fromCurrency: dto.fromCanonical,
      toCurrency: dto.toCanonical,
      fromAmount: dto.fromAmount,
      expectedToAmount: 0,
      depositAddress: data.payinAddress,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      createdAt: new Date().toISOString(),
    };
  }

  async getOrderStatus(externalId: string): Promise<OrderStatusDto> {
    type StatusResponse = {
      id: string;
      status: OrderStatus;
      payinAddress: string;
      payoutAddress: string;
      expectedSendAmount: number;
      expectedReceiveAmount: number;
      amountSend?: number;
      amountReceive?: number;
      updatedAt: string;
    };
    const data = await this.get<StatusResponse>(`/v1/transactions/${externalId}/${this.apiKey}`, {});
    await this.orderRepo.update({ externalId }, { status: data.status });
    return {
      id: externalId,
      status: data.status,
      fromAmount: data.amountSend,
      toAmount: data.amountReceive,
      expectedSendAmount: data.expectedSendAmount,
      expectedReceiveAmount: data.expectedReceiveAmount,
      depositAddress: data.payinAddress,
      payoutAddress: data.payoutAddress,
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
  }

  /** Translate canonical ticker to ChangeNow ticker + optional network. Throws 400 if unsupported. */
  private toCnCode(canonical: string): { ticker: string; network?: string } {
    const entry = CURRENCY_MAP[canonical];
    if (!entry) {
      throw new HttpException(`Unsupported currency: ${canonical}`, 400);
    }
    return { ticker: entry.changenow.ticker, network: entry.changenow.network };
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
        Object.entries(opts.params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
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
        const errBody = await res.json().catch(() => ({})) as { message?: string };
        const status = res.status;
        if ((status === 429 || status >= 500) && attempt < MAX_RETRIES) {
          const delay = 2 ** attempt * 300;
          this.logger.warn(`ChangeNow ${method} ${path} failed (${status}), retry ${attempt} in ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          return this.request<T>(method, path, opts, attempt + 1);
        }
        throw new HttpException(errBody?.message ?? 'ChangeNow API error', status);
      }

      return res.json() as Promise<T>;
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('ChangeNow API unreachable', 502);
    }
  }
}
