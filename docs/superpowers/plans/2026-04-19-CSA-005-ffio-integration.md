# CSA-005: ff.io API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ff.io (FixedFloat) as a fallback swap provider alongside ChangeNow — same interface, parallel quote fetching, best-rate selection routing orders to whichever provider returns the higher `toAmount`.

**Architecture:** A new NestJS module `libs/backend/ffio/` mirrors `libs/backend/change-now/` — currencies, float/fixed quotes, create order, status polling. ff.io uses HMAC-SHA256 request signing (`X-API-KEY` + `X-API-SIGN` headers). A new `SwapRouterService` inside `ChangeNowModule` fetches both providers' quotes in parallel and routes the order creation to the winner. The `ChangeNowController` is updated to delegate all swap calls through the router. A `provider` column is added to `change_now_orders` to tag which API created each order. The existing `ChangeNow` entity and all existing DTOs are reused unchanged.

**Tech Stack:** NestJS, TypeORM, MySQL, TypeScript, native `fetch`, Node.js `crypto` (HMAC-SHA256), ff.io REST API v2, existing `libs/commons/src/dtos/change-now/` DTOs

---

## ff.io API Reference

- **Base URL:** `https://ff.io/api/v2/`
- **Auth headers (every request):**
  - `Content-Type: application/json; charset=UTF-8`
  - `X-API-KEY: <your-api-key>`
  - `X-API-SIGN: HMAC-SHA256(json_body_string, api_secret)` — hex digest
- **All endpoints:** POST
- **Rate limit:** 250 weight units/min; `/create` costs 50, all others cost 1
- **Response envelope:** `{ "code": 0, "msg": "", "data": ... }` — code 0 = success

### Endpoint summary

| Endpoint | Purpose |
|----------|---------|
| `POST /ccies` | List supported currencies |
| `POST /price` | Get float or fixed rate quote |
| `POST /create` | Create an order (50 weight units) |
| `POST /order` | Get order status by `id` + `token` |

---

## Files to Create / Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `libs/backend/ffio/src/lib/ffio.service.ts` | ff.io API client |
| Create | `libs/backend/ffio/src/lib/ffio.module.ts` | NestJS module wiring |
| Create | `libs/backend/ffio/src/index.ts` | Public exports |
| Create | `libs/backend/ffio/project.json` | NX project registration |
| Modify | `tsconfig.base.json` | Add `@workspace/ffio` path alias |
| Modify | `libs/backend/be-commons/src/entities/change-now.entity.ts` | Add `provider` + `orderToken` columns |
| Create | `libs/backend/migrations/20260419-add-provider-column.ts` | Migration: add provider + orderToken columns |
| Create | `libs/backend/change-now/src/lib/swap-router.service.ts` | Parallel quotes + best-rate routing |
| Modify | `libs/backend/change-now/src/lib/change-now.module.ts` | Import FfioModule, provide SwapRouterService |
| Modify | `libs/backend/change-now/src/lib/change-now.controller.ts` | Delegate to SwapRouterService |
| Modify | `libs/backend/change-now/src/index.ts` | Export SwapRouterService |
| Modify | `apps/api/src/app/app.module.ts` | Import FfioModule |

---

## Branch

Before starting:
```bash
git checkout -b CSA/CSA-005/ffio-integration
```

---

### Task 1: Create ff.io NestJS service

**Files:**
- Create: `libs/backend/ffio/src/lib/ffio.service.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p libs/backend/ffio/src/lib
```

- [ ] **Step 2: Create `ffio.service.ts`**

```ts
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
    // Retrieve the token we stored at order creation time
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
```

---

### Task 2: Create ff.io NestJS module + NX wiring

**Files:**
- Create: `libs/backend/ffio/src/lib/ffio.module.ts`
- Create: `libs/backend/ffio/src/index.ts`
- Create: `libs/backend/ffio/project.json`
- Modify: `tsconfig.base.json`

- [ ] **Step 1: Create `ffio.module.ts`**

```ts
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
```

- [ ] **Step 2: Create `index.ts`**

```ts
export * from './lib/ffio.module';
export * from './lib/ffio.service';
```

- [ ] **Step 3: Create `project.json`**

```json
{
  "name": "ffio",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/backend/ffio/src",
  "projectType": "library",
  "tags": [],
  "targets": {}
}
```

- [ ] **Step 4: Add TypeScript path alias to `tsconfig.base.json`**

In the `paths` object, add after the `@workspace/change-now` entries:

```json
"@workspace/ffio": ["libs/backend/ffio/src/index.ts"],
"@workspace/ffio/*": ["libs/backend/ffio/src/*"],
```

- [ ] **Step 5: Commit**

```bash
git add libs/backend/ffio/ tsconfig.base.json
git commit -m "feat(swap): add ff.io NestJS module"
```

---

### Task 3: Add `provider` + `orderToken` columns to `ChangeNow` entity + migration

**Files:**
- Modify: `libs/backend/be-commons/src/entities/change-now.entity.ts`
- Create: `libs/backend/migrations/20260419-add-provider-column.ts`

- [ ] **Step 1: Add columns to entity**

Add these two fields to the `ChangeNow` class after `externalId`:

```ts
@Column({ type: 'varchar', length: 32, default: 'changenow' })
provider!: string;

@Column({ type: 'varchar', length: 128, nullable: true })
orderToken?: string;
```

- [ ] **Step 2: Create migration**

Create `libs/backend/migrations/20260419-add-provider-column.ts`:

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderColumn20260419 implements MigrationInterface {
  name = 'AddProviderColumn20260419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`change_now_orders\`
        ADD COLUMN \`provider\` varchar(32) NOT NULL DEFAULT 'changenow',
        ADD COLUMN \`orderToken\` varchar(128) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`change_now_orders\`
        DROP COLUMN \`provider\`,
        DROP COLUMN \`orderToken\`
    `);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add libs/backend/be-commons/src/entities/change-now.entity.ts \
        libs/backend/migrations/20260419-add-provider-column.ts
git commit -m "feat(db): add provider and orderToken columns to change_now_orders"
```

---

### Task 4: Create `SwapRouterService`

**Files:**
- Create: `libs/backend/change-now/src/lib/swap-router.service.ts`

- [ ] **Step 1: Create `swap-router.service.ts`**

```ts
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
    // ChangeNow has richer metadata; use as canonical list
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
```

---

### Task 5: Wire `SwapRouterService` into `ChangeNowModule` + update controller

**Files:**
- Modify: `libs/backend/change-now/src/lib/change-now.module.ts`
- Modify: `libs/backend/change-now/src/lib/change-now.controller.ts`
- Modify: `libs/backend/change-now/src/index.ts`

- [ ] **Step 1: Update `change-now.module.ts`**

Replace full file content:

```ts
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
```

- [ ] **Step 2: Update `change-now.controller.ts`**

Replace full file content:

```ts
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
```

- [ ] **Step 3: Export `SwapRouterService` from `change-now/src/index.ts`**

Add at end of `libs/backend/change-now/src/index.ts`:

```ts
export * from './lib/swap-router.service';
```

- [ ] **Step 4: Commit**

```bash
git add libs/backend/change-now/src/lib/change-now.module.ts \
        libs/backend/change-now/src/lib/change-now.controller.ts \
        libs/backend/change-now/src/lib/swap-router.service.ts \
        libs/backend/change-now/src/index.ts
git commit -m "feat(swap): wire SwapRouterService — parallel quotes, best-rate routing"
```

---

### Task 6: Register `FfioModule` in `AppModule` + verify compilation

**Files:**
- Modify: `apps/api/src/app/app.module.ts`

- [ ] **Step 1: Update `app.module.ts`**

Replace full file content:

```ts
import { Module } from '@nestjs/common';

import { AuthModule } from '@workspace/auth';
import { ChangeNowModule } from '@workspace/change-now';
import { ConfigModule } from '@workspace/config';
import { FfioModule } from '@workspace/ffio';
import { FilesModule } from '@workspace/files-api/lib/files.module';
import { IPUALogModule } from '@workspace/ipualog';
import { MysqlDbModule } from '@workspace/mysql-db';
import { SocketIoModule } from '@workspace/socket-io';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MysqlDbModule,
    ChangeNowModule,
    FfioModule,
    ConfigModule,
    SocketIoModule,
    FilesModule,
    AuthModule,
    IPUALogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -p apps/api/tsconfig.app.json --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/app/app.module.ts
git commit -m "feat(swap): register FfioModule in AppModule"
```

---

### Task 7: Raise PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin CSA/CSA-005/ffio-integration
```

- [ ] **Step 2: Open PR**

```bash
gh pr create \
  --title "CSA-005: ff.io API integration (fallback + best-rate routing)" \
  --body "$(cat <<'EOF'
## Summary
- Adds \`FfioService\` in \`libs/backend/ffio/\` wrapping ff.io v2 API (currencies, float/fixed quotes, create order, status) with HMAC-SHA256 signing
- Adds \`SwapRouterService\` that fetches quotes from ChangeNow and ff.io in parallel and routes order creation to whichever returns the higher \`toAmount\`
- Adds \`provider\` + \`orderToken\` columns to \`change_now_orders\` (migration included)
- \`ChangeNowController\` now delegates all swap calls through \`SwapRouterService\` — API routes unchanged

## Test plan
- [ ] Set \`FFIO_API_KEY\` + \`FFIO_API_SECRET\` env vars
- [ ] \`GET /change-now/quote/float?fromCurrency=btc&toCurrency=eth&fromAmount=0.1\` returns quote with \`provider\` field indicating winner
- [ ] If ff.io is unreachable, ChangeNow quote is used as sole provider (no error)
- [ ] If ChangeNow is unreachable, ff.io quote is used as sole provider
- [ ] \`POST /change-now/orders\` creates order; DB row has correct \`provider\` value
- [ ] \`GET /change-now/orders/:id\` polls correct provider based on stored \`provider\` column

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
