# CSA-004: Database Schema Design — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the three missing TypeORM entities (`OrderEvent`, `SupportedAsset`, `AffiliateCode`), generate a migration, and write a seed script that populates `supported_assets` from the ChangeNow `/currencies` API.

**Architecture:** Entities go in `libs/backend/be-commons/src/entities/`. The existing `ChangeNow` order entity (`change_now_orders`) is already present — we extend the schema alongside it without touching it. A new TypeORM migration file goes in `libs/backend/migrations/`. The seed script is a standalone Node/TS script in `scripts/` that calls the ChangeNow API and upserts rows.

**Tech Stack:** TypeORM, MySQL, NestJS, TypeScript, existing `data-source.ts` in `libs/backend/`

---

## Branch

Before starting:
```bash
git checkout -b CSA/CSA-004/database-schema-design
```

---

### Task 1: `OrderEvent` entity

**Files:**
- Create: `libs/backend/be-commons/src/entities/order-event.entity.ts`
- Modify: `libs/backend/be-commons/src/entities/index.ts`

- [ ] **Step 1: Create `order-event.entity.ts`**

```ts
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChangeNow } from './change-now.entity';

@Entity('order_events')
export class OrderEvent {
  constructor(props: Partial<OrderEvent>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => ChangeNow, { onDelete: 'CASCADE' })
  order!: ChangeNow;

  @Column({ type: 'varchar', length: 64 })
  eventType!: string;

  @Column({ type: 'json', nullable: true })
  payload?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
```

- [ ] **Step 2: Export from `libs/backend/be-commons/src/entities/index.ts`**

Check current exports then add:
```bash
grep -n "export" libs/backend/be-commons/src/entities/index.ts | head -20
```

Add at end of file:
```ts
export * from './order-event.entity';
```

- [ ] **Step 3: Commit**

```bash
git add libs/backend/be-commons/src/entities/order-event.entity.ts libs/backend/be-commons/src/entities/index.ts
git commit -m "feat(db): add OrderEvent entity"
```

---

### Task 2: `SupportedAsset` entity

**Files:**
- Create: `libs/backend/be-commons/src/entities/supported-asset.entity.ts`
- Modify: `libs/backend/be-commons/src/entities/index.ts`

- [ ] **Step 1: Create `supported-asset.entity.ts`**

```ts
import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('supported_assets')
export class SupportedAsset {
  constructor(props: Partial<SupportedAsset>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  ticker!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  network!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  minAmount?: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  maxAmount?: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @UpdateDateColumn()
  lastSyncedAt!: Date;
}
```

- [ ] **Step 2: Export from index**

Add at end of `libs/backend/be-commons/src/entities/index.ts`:
```ts
export * from './supported-asset.entity';
```

- [ ] **Step 3: Commit**

```bash
git add libs/backend/be-commons/src/entities/supported-asset.entity.ts libs/backend/be-commons/src/entities/index.ts
git commit -m "feat(db): add SupportedAsset entity"
```

---

### Task 3: `AffiliateCode` entity

**Files:**
- Create: `libs/backend/be-commons/src/entities/affiliate-code.entity.ts`
- Modify: `libs/backend/be-commons/src/entities/index.ts`

- [ ] **Step 1: Create `affiliate-code.entity.ts`**

```ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('affiliate_codes')
export class AffiliateCode {
  constructor(props: Partial<AffiliateCode>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ownerLabel?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  revenueSharePct!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
```

- [ ] **Step 2: Export from index**

Add at end of `libs/backend/be-commons/src/entities/index.ts`:
```ts
export * from './affiliate-code.entity';
```

- [ ] **Step 3: Commit**

```bash
git add libs/backend/be-commons/src/entities/affiliate-code.entity.ts libs/backend/be-commons/src/entities/index.ts
git commit -m "feat(db): add AffiliateCode entity"
```

---

### Task 4: Wire entities into `data-source.ts`

**Files:**
- Modify: `libs/backend/data-source.ts`

The current `data-source.ts` has the `entities` line commented out. We need to un-comment it and point it at the new entities so TypeORM CLI can generate a migration.

- [ ] **Step 1: Update `data-source.ts`**

Replace:
```ts
//   entities: ['libs/backend/**/src/**/*.entity.ts','libs/backend/**/src/**/*.entity.js'],
```
With:
```ts
  entities: ['libs/backend/**/src/**/*.entity.ts', 'libs/backend/**/src/**/*.entity.js'],
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -p libs/backend/be-commons/tsconfig.json --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add libs/backend/data-source.ts
git commit -m "feat(db): enable entities glob in data-source.ts"
```

---

### Task 5: Generate TypeORM migration

**Files:**
- Create: `libs/backend/migrations/20260419-swap-schema.ts` (generated)

- [ ] **Step 1: Generate the migration**

```bash
cd /Users/arunsharma/projects/csa && \
  DB_TYPE=mysql DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=root DB_NAME=csa \
  npx typeorm-ts-node-commonjs migration:generate \
    -d libs/backend/data-source.ts \
    libs/backend/migrations/20260419-swap-schema \
    2>&1 | tail -10
```

If MySQL is not running locally, generate manually instead — **Step 2 alternative**.

- [ ] **Step 2 (alternative — if DB not available): Create migration manually**

Create `libs/backend/migrations/20260419-swap-schema.ts`:

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SwapSchema20260419 implements MigrationInterface {
  name = 'SwapSchema20260419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`order_events\` (
        \`id\` varchar(36) NOT NULL,
        \`eventType\` varchar(64) NOT NULL,
        \`payload\` json NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`orderId\` varchar(36) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_order_events_orderId\` (\`orderId\`),
        CONSTRAINT \`FK_order_events_order\` FOREIGN KEY (\`orderId\`)
          REFERENCES \`change_now_orders\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`supported_assets\` (
        \`id\` varchar(36) NOT NULL,
        \`ticker\` varchar(20) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`network\` varchar(50) NOT NULL,
        \`logoUrl\` varchar(500) NULL,
        \`minAmount\` decimal(20,8) NULL,
        \`maxAmount\` decimal(20,8) NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`lastSyncedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_supported_assets_ticker\` (\`ticker\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`affiliate_codes\` (
        \`id\` varchar(36) NOT NULL,
        \`code\` varchar(64) NOT NULL,
        \`ownerLabel\` varchar(255) NULL,
        \`revenueSharePct\` decimal(5,2) NOT NULL DEFAULT 0,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_affiliate_codes_code\` (\`code\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`affiliate_codes\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supported_assets\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order_events\``);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add libs/backend/migrations/20260419-swap-schema.ts
git commit -m "feat(db): migration for order_events, supported_assets, affiliate_codes"
```

---

### Task 6: Seed script for `supported_assets`

**Files:**
- Create: `scripts/seed-supported-assets.ts`

- [ ] **Step 1: Create seed script**

```ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SupportedAsset } from '../libs/backend/be-commons/src/entities/supported-asset.entity';

const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY ?? '';
const API_URL = 'https://api.changenow.io/v2/exchange/currencies?active=true&flow=standard';

async function fetchCurrencies(): Promise<any[]> {
  const res = await fetch(API_URL, {
    headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
  });
  if (!res.ok) throw new Error(`ChangeNow API error: ${res.status}`);
  return res.json();
}

async function main() {
  const ds = new DataSource({
    type: (process.env.DB_TYPE as any) || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'csa',
    entities: [SupportedAsset],
    synchronize: false,
  });

  await ds.initialize();
  const repo = ds.getRepository(SupportedAsset);

  const currencies = await fetchCurrencies();
  console.log(`Fetched ${currencies.length} currencies from ChangeNow`);

  for (const c of currencies) {
    await repo.upsert(
      {
        ticker: c.ticker,
        name: c.name,
        network: c.network ?? c.ticker,
        logoUrl: c.image ?? null,
        minAmount: c.minAmount ?? null,
        maxAmount: c.maxAmount ?? null,
        isActive: c.isActive !== false,
      },
      { conflictPaths: ['ticker', 'network'] }
    );
  }

  console.log(`Upserted ${currencies.length} supported assets`);
  await ds.destroy();
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Add npm script to root `package.json`**

In root `package.json`, inside `"scripts"`, add:
```json
"seed:assets": "ts-node -r tsconfig-paths/register scripts/seed-supported-assets.ts"
```

- [ ] **Step 3: Verify script runs (dry-run typecheck only — no real DB needed)**

```bash
npx tsc --noEmit --esModuleInterop --module commonjs --target es2020 \
  scripts/seed-supported-assets.ts 2>&1 | head -20
```

Expected: no errors (or only "Cannot find module" if ts-node isn't resolving paths — that's OK for a type-only check).

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-supported-assets.ts package.json
git commit -m "feat(db): seed script for supported_assets from ChangeNow API"
```

---

### Task 7: Raise PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin CSA/CSA-004/database-schema-design
```

- [ ] **Step 2: Open PR**

```bash
gh pr create \
  --title "CSA-004: Database schema — order_events, supported_assets, affiliate_codes" \
  --body "$(cat <<'EOF'
## Summary
- Adds `OrderEvent`, `SupportedAsset`, `AffiliateCode` TypeORM entities in `libs/backend/be-commons/src/entities/`
- Adds TypeORM migration `20260419-swap-schema` creating the three tables alongside existing `change_now_orders`
- Adds `scripts/seed-supported-assets.ts` to populate `supported_assets` from ChangeNow `/currencies` API

## Test plan
- [ ] Run `pnpm seed:assets` with valid `CHANGENOW_API_KEY` — confirms rows upserted
- [ ] Run migration against fresh MySQL DB — all three tables created with correct indexes and FK
- [ ] TypeScript compiles with no errors: `npx tsc -p libs/backend/be-commons/tsconfig.json --noEmit`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
