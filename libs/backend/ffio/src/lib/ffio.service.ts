import { createHmac } from 'node:crypto';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { QuoteRequestDto, QuoteResponseDto } from '@workspace/commons/dtos/change-now/quote.dto';
import { CreateOrderDto, RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import { OrderDto, OrderStatus, OrderStatusDto } from '@workspace/commons/dtos/change-now/order.dto';

const BASE_URL = 'https://ff.io/api/v2';
const MAX_RETRIES = 3;

interface FfioResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface FfioCurrency {
  code: string; coin: string; network: string; name: string;
  recv: boolean; send: boolean; logo: string;
}

interface FfioPriceData {
  from: { amount: number; min: number; max: number };
  to: { amount: number };
  errors: string[];
}

interface FfioOrderData {
  id: string;
  token: string;
  status: string;
  from: { address: string; amount: string; tx: { id: string | null; amount: string | null } };
  to: { address: string; amount: string; tx: { id: string | null; amount: string | null } };
  time: { update: number };
}

@Injectable()
export class FfioService {
  private readonly logger = new Logger(FfioService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(
    @InjectRepository(ChangeNow)
    private readonly orderRepo: Repository<ChangeNow>
  ) {
    this.apiKey = process.env['FFIO_API_KEY'] ?? '';
    this.apiSecret = process.env['FFIO_API_SECRET'] ?? '';
  }

  async getCurrencies(): Promise<CurrencyDto[]> {
    const raw = await this.call<FfioCurrency[]>('/ccies', {});
    return raw.map((c) => ({
      ticker: c.code,
      name: c.name,
      image: c.logo ?? '',
      network: c.network ?? c.coin,
      hasExternalId: false,
      isExtraIdSupported: false,
      isFiat: false,
      featured: false,
      isStable: false,
      supportsFixedRate: true,
      tokenContract: null,
      buy: c.recv,
      sell: c.send,
      legacyTicker: c.code,
    }));
  }

  async getFloatQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const data = await this.call<FfioPriceData>('/price', {
      type: 'float',
      fromCcy: req.fromCurrency,
      toCcy: req.toCurrency,
      direction: 'from',
      amount: req.fromAmount,
    });
    if (data.errors?.length) {
      throw new HttpException(`ff.io price error: ${data.errors.join(', ')}`, 422);
    }
    return {
      fromAmount: req.fromAmount,
      toAmount: data.to.amount,
      provider: 'ffio',
    };
  }

  async getFixedQuote(req: QuoteRequestDto): Promise<QuoteResponseDto> {
    const data = await this.call<FfioPriceData>('/price', {
      type: 'fixed',
      fromCcy: req.fromCurrency,
      toCcy: req.toCurrency,
      direction: 'from',
      amount: req.fromAmount,
    });
    if (data.errors?.length) {
      throw new HttpException(`ff.io price error: ${data.errors.join(', ')}`, 422);
    }
    return {
      fromAmount: req.fromAmount,
      toAmount: data.to.amount,
      provider: 'ffio',
    };
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderDto> {
    const data = await this.call<FfioOrderData>('/create', {
      type: dto.rateType === RateType.FIXED ? 'fixed' : 'float',
      fromCcy: dto.fromCurrency,
      toCcy: dto.toCurrency,
      direction: 'from',
      amount: dto.fromAmount,
      toAddress: dto.toAddress,
    });

    const order = this.orderRepo.create({
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.fromAmount,
      depositAddress: data.from.address,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      externalId: data.id,
      provider: 'ffio',
      orderToken: data.token,
    });
    await this.orderRepo.save(order);

    return {
      id: data.id,
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.fromAmount,
      expectedToAmount: parseFloat(data.to.amount),
      depositAddress: data.from.address,
      toAddress: dto.toAddress,
      status: OrderStatus.WAITING,
      rateType: dto.rateType,
      createdAt: new Date().toISOString(),
    };
  }

  async getOrderStatus(externalId: string): Promise<OrderStatusDto> {
    const order = await this.orderRepo.findOneOrFail({ where: { externalId } });
    const data = await this.call<FfioOrderData>('/order', {
      id: externalId,
      token: order.orderToken,
    });

    const status = this.mapStatus(data.status);
    await this.orderRepo.update({ externalId }, { status });

    return {
      id: externalId,
      status,
      fromAmount: data.from.tx.amount ? parseFloat(data.from.tx.amount) : undefined,
      toAmount: data.to.tx.amount ? parseFloat(data.to.tx.amount) : undefined,
      depositAddress: data.from.address,
      payoutAddress: data.to.address,
      updatedAt: new Date(data.time.update * 1000).toISOString(),
    };
  }

  private mapStatus(raw: string): OrderStatus {
    const map: Record<string, OrderStatus> = {
      NEW: OrderStatus.WAITING,
      PENDING: OrderStatus.CONFIRMING,
      EXCHANGE: OrderStatus.EXCHANGING,
      WITHDRAW: OrderStatus.SENDING,
      DONE: OrderStatus.FINISHED,
      EXPIRED: OrderStatus.FAILED,
      EMERGENCY: OrderStatus.FAILED,
    };
    return map[raw] ?? OrderStatus.WAITING;
  }

  private sign(body: string): string {
    return createHmac('sha256', this.apiSecret).update(body).digest('hex');
  }

  private async call<T>(path: string, body: Record<string, unknown>, attempt = 1): Promise<T> {
    const json = JSON.stringify(body);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-API-KEY': this.apiKey,
      'X-API-SIGN': this.sign(json),
    };

    try {
      const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: json });

      if (!res.ok) {
        const status = res.status;
        if ((status === 429 || status >= 500) && attempt < MAX_RETRIES) {
          const delay = 2 ** attempt * 300;
          this.logger.warn(`ff.io POST ${path} failed (${status}), retry ${attempt} in ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          return this.call<T>(path, body, attempt + 1);
        }
        throw new HttpException(`ff.io API error ${status}`, status);
      }

      const envelope = await res.json() as FfioResponse<T>;
      if (envelope.code !== 0) {
        throw new HttpException(`ff.io error: ${envelope.msg}`, 422);
      }
      return envelope.data;
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('ff.io API unreachable', 502);
    }
  }
}
