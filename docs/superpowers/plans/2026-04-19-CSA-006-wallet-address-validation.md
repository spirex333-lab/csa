# CSA-006: Wallet Address Validation Library — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure-TypeScript `validateAddress(ticker: string, address: string): boolean` utility in `libs/commons/src/validation/` shared between the NestJS backend (custom class-validator decorator) and the Next.js webapp (inline field validation).

**Architecture:** A single validation function dispatches to per-coin validators using a ticker→validator map. Coins with established npm libraries (BTC, ETH, SOL) use those; coins without (XMR, TRC20) use regex + checksum logic. A custom class-validator decorator `@IsValidWalletAddress()` wraps the function for use in NestJS DTOs. No new NestJS modules — this is pure shared library code.

**Tech Stack:** TypeScript, `bitcoinjs-lib` (BTC), `@solana/web3.js` (SOL), `bs58` (base58 decode for XMR/TRC20), `ethers` (ETH checksum), Jest, class-validator

---

## Coins to Support

| Ticker key | Network | Validation approach |
|---|---|---|
| `btc` | Bitcoin | `bitcoinjs-lib` `address.toOutputScript` — accepts P2PKH, P2SH, bech32 |
| `eth` | Ethereum | regex `^0x[0-9a-fA-F]{40}$` + optional EIP-55 checksum via `ethers.getAddress` |
| `usdt` (ERC20) | Ethereum | same as ETH |
| `usdttrc20` / `usdt_trc20` | Tron | base58check decode, first byte = `0x41`, length = 21 bytes |
| `sol` | Solana | `PublicKey` constructor from `@solana/web3.js` — throws on invalid |
| `xmr` | Monero | base58 decode, length = 69 bytes (standard) or 77 bytes (integrated) |

---

## Files to Create / Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `libs/commons/src/validation/wallet-address.ts` | Core `validateAddress` function + per-coin validators |
| Create | `libs/commons/src/validation/wallet-address.spec.ts` | Jest tests for all coin types |
| Create | `libs/commons/jest.config.ts` | Jest config for the commons lib (not yet present) |
| Create | `libs/commons/tsconfig.spec.json` | tsconfig for spec files |
| Modify | `libs/commons/src/validation/index.ts` | Export `validateAddress` and `IsValidWalletAddress` |
| Create | `libs/backend/be-commons/src/decorators/is-valid-wallet-address.decorator.ts` | `@IsValidWalletAddress(ticker)` class-validator decorator |
| Modify | `libs/commons/src/dtos/change-now/create-order.dto.ts` | Add `@IsValidWalletAddress('toAddress')` to `toAddress` field |

---

## Branch

```bash
git checkout main
git pull
git checkout -b CSA/CSA-006/wallet-address-validation
```

---

### Task 1: Add Jest infrastructure to `libs/commons`

The `commons` lib has spec files (`core/index.spec.ts`, `network/fetch/index.spec.ts`) but no jest config — they never run. This task wires up Jest so we can write and run tests.

**Files:**
- Create: `libs/commons/jest.config.ts`
- Create: `libs/commons/tsconfig.spec.json`

- [ ] **Step 1: Create `libs/commons/jest.config.ts`**

```ts
export default {
  displayName: 'commons',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/commons',
};
```

- [ ] **Step 2: Create `libs/commons/tsconfig.spec.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "types": ["jest", "node"]
  },
  "include": [
    "jest.config.ts",
    "src/**/*.test.ts",
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

- [ ] **Step 3: Verify Jest can find and run the existing spec**

```bash
npx jest --projects libs/commons --passWithNoTests
```

Expected: `No tests found, exiting with code 0` (or tests pass if the existing specs work).

- [ ] **Step 4: Commit**

```bash
git add libs/commons/jest.config.ts libs/commons/tsconfig.spec.json
git commit -m "chore(commons): add jest config to enable unit tests"
```

---

### Task 2: Install required packages

**Files:** `package.json` (side effect only — no code changes)

- [ ] **Step 1: Install validation dependencies**

```bash
pnpm add bitcoinjs-lib @solana/web3.js bs58 ethers
pnpm add -D @types/bs58
```

- [ ] **Step 2: Verify imports resolve**

```bash
node -e "require('bitcoinjs-lib'); require('@solana/web3.js'); require('bs58'); require('ethers'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add bitcoinjs-lib, @solana/web3.js, bs58, ethers for address validation"
```

---

### Task 3: Write failing tests for `validateAddress`

**Files:**
- Create: `libs/commons/src/validation/wallet-address.spec.ts`

- [ ] **Step 1: Create the test file**

```ts
import { validateAddress } from './wallet-address';

describe('validateAddress', () => {
  // BTC
  describe('btc', () => {
    it('accepts P2PKH address', () => {
      expect(validateAddress('btc', '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na')).toBe(true);
    });
    it('accepts bech32 P2WPKH address', () => {
      expect(validateAddress('btc', 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    });
    it('accepts P2SH address', () => {
      expect(validateAddress('btc', '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('btc', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('btc', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(false);
    });
  });

  // ETH
  describe('eth', () => {
    it('accepts lowercase hex address', () => {
      expect(validateAddress('eth', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('accepts EIP-55 checksummed address', () => {
      expect(validateAddress('eth', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(true);
    });
    it('rejects wrong checksum', () => {
      expect(validateAddress('eth', '0xDE0B295669A9FD93D5F28D9EC85E40F4CB697BAE')).toBe(false);
    });
    it('rejects too-short hex', () => {
      expect(validateAddress('eth', '0xde0b295')).toBe(false);
    });
    it('rejects missing 0x prefix', () => {
      expect(validateAddress('eth', 'de0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // USDT ERC20 — same rules as ETH
  describe('usdt', () => {
    it('accepts valid ETH-format address', () => {
      expect(validateAddress('usdt', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('rejects invalid address', () => {
      expect(validateAddress('usdt', 'notanaddress')).toBe(false);
    });
  });

  // USDT TRC20
  describe('usdttrc20', () => {
    it('accepts valid Tron address', () => {
      expect(validateAddress('usdttrc20', 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7')).toBe(true);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('usdttrc20', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
    it('rejects garbage', () => {
      expect(validateAddress('usdttrc20', 'notanaddress')).toBe(false);
    });
  });

  // SOL
  describe('sol', () => {
    it('accepts valid Solana public key', () => {
      expect(validateAddress('sol', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('sol', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('sol', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // XMR
  describe('xmr', () => {
    it('accepts standard Monero address (95 chars)', () => {
      expect(validateAddress('xmr', '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('xmr', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('xmr', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // Unknown ticker
  describe('unknown ticker', () => {
    it('returns false for unrecognised coin', () => {
      expect(validateAddress('UNKNOWN_COIN_XYZ', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx jest --projects libs/commons wallet-address.spec.ts
```

Expected: FAIL — `Cannot find module './wallet-address'`

- [ ] **Step 3: Commit the test file**

```bash
git add libs/commons/src/validation/wallet-address.spec.ts
git commit -m "test(validation): add failing tests for validateAddress"
```

---

### Task 4: Implement `validateAddress`

**Files:**
- Create: `libs/commons/src/validation/wallet-address.ts`

- [ ] **Step 1: Create the implementation**

```ts
import * as bitcoin from 'bitcoinjs-lib';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { getAddress, isAddress } from 'ethers';

function validateBtc(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
    return true;
  } catch {
    return false;
  }
}

function validateEth(address: string): boolean {
  if (!isAddress(address)) return false;
  // If mixed-case, enforce EIP-55 checksum
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    try {
      return getAddress(address) === address;
    } catch {
      return false;
    }
  }
  return true;
}

function validateTrc20(address: string): boolean {
  if (!address.startsWith('T')) return false;
  try {
    const decoded = bs58.decode(address);
    // Tron address: version byte 0x41 + 20-byte hash + 4-byte checksum = 25 bytes
    return decoded.length === 25 && decoded[0] === 0x41;
  } catch {
    return false;
  }
}

function validateSol(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

function validateXmr(address: string): boolean {
  // Standard: 95 chars, integrated: 106 chars — both base58
  if (address.length !== 95 && address.length !== 106) return false;
  try {
    const decoded = bs58.decode(address);
    // Standard address decodes to 69 bytes, integrated to 77 bytes
    return decoded.length === 69 || decoded.length === 77;
  } catch {
    return false;
  }
}

const VALIDATORS: Record<string, (address: string) => boolean> = {
  btc: validateBtc,
  eth: validateEth,
  usdt: validateEth,       // ERC20 USDT uses ETH addresses
  usdttrc20: validateTrc20,
  usdt_trc20: validateTrc20,
  sol: validateSol,
  xmr: validateXmr,
};

export function validateAddress(ticker: string, address: string): boolean {
  const validator = VALIDATORS[ticker.toLowerCase()];
  if (!validator) return false;
  try {
    return validator(address);
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Run tests — verify they pass**

```bash
npx jest --projects libs/commons wallet-address.spec.ts
```

Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add libs/commons/src/validation/wallet-address.ts
git commit -m "feat(validation): implement validateAddress for BTC, ETH, USDT, TRC20, SOL, XMR"
```

---

### Task 5: Export from validation index

**Files:**
- Modify: `libs/commons/src/validation/index.ts`

Current content:
```ts
export * from "./matching-passwords"
export * from "./validation"
```

- [ ] **Step 1: Add export**

```ts
export * from "./matching-passwords"
export * from "./validation"
export * from "./wallet-address"
```

- [ ] **Step 2: Verify the export compiles**

```bash
npx tsc -p libs/commons/tsconfig.lib.json --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add libs/commons/src/validation/index.ts
git commit -m "feat(validation): export validateAddress from commons validation index"
```

---

### Task 6: Create `@IsValidWalletAddress` class-validator decorator

This decorator is used on NestJS DTOs. It lives in `libs/backend/be-commons/src/decorators/` following the existing pattern (see `is-public.decorator.ts`).

**Files:**
- Create: `libs/backend/be-commons/src/decorators/is-valid-wallet-address.decorator.ts`

- [ ] **Step 1: Create the decorator**

```ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { validateAddress } from '@workspace/commons/validation/wallet-address';

export function IsValidWalletAddress(
  tickerPropertyOrValue: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidWalletAddress',
      target: (object as any).constructor,
      propertyName,
      constraints: [tickerPropertyOrValue],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [tickerOrProp] = args.constraints as [string];
          const obj = args.object as Record<string, unknown>;
          // If tickerOrProp is a property name on the DTO, read it dynamically
          const ticker = (obj[tickerOrProp] as string) ?? tickerOrProp;
          if (typeof value !== 'string' || typeof ticker !== 'string') return false;
          return validateAddress(ticker, value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not a valid wallet address for the selected coin`;
        },
      },
    });
  };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc -p libs/backend/be-commons/tsconfig.lib.json --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add libs/backend/be-commons/src/decorators/is-valid-wallet-address.decorator.ts
git commit -m "feat(validation): add @IsValidWalletAddress class-validator decorator"
```

---

### Task 7: Apply decorator to `CreateOrderDto` + wire `toAddress` validation

**Files:**
- Modify: `libs/commons/src/dtos/change-now/create-order.dto.ts`

Current `toAddress` field:
```ts
@IsString()
@IsNotEmpty()
toAddress!: string;
```

- [ ] **Step 1: Update `create-order.dto.ts`**

Replace the full file content:

```ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsValidWalletAddress } from '@workspace/be-commons/decorators/is-valid-wallet-address.decorator';

export enum RateType {
  FLOAT = 'float',
  FIXED = 'fixed',
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fromCurrency!: string;

  @IsString()
  @IsNotEmpty()
  toCurrency!: string;

  @IsNumber()
  @Min(0)
  fromAmount!: number;

  @IsString()
  @IsNotEmpty()
  // Ticker is read from toCurrency at validation time
  @IsValidWalletAddress('toCurrency')
  toAddress!: string;

  @IsEnum(RateType)
  rateType!: RateType;

  @IsString()
  @IsOptional()
  fromNetwork?: string;

  @IsString()
  @IsOptional()
  toNetwork?: string;

  @IsString()
  @IsOptional()
  rateId?: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles for the whole API**

```bash
npx tsc -p apps/api/tsconfig.app.json --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add libs/commons/src/dtos/change-now/create-order.dto.ts
git commit -m "feat(orders): validate toAddress wallet format on order creation"
```

---

### Task 8: Raise PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin CSA/CSA-006/wallet-address-validation
```

- [ ] **Step 2: Create PR**

```bash
gh pr create \
  --title "CSA-006: wallet address validation library" \
  --body "$(cat <<'EOF'
## Summary
- Adds \`validateAddress(ticker, address): boolean\` in \`libs/commons/src/validation/wallet-address.ts\` — supports BTC (P2PKH/P2SH/bech32), ETH (EIP-55), USDT ERC20, USDT TRC20, SOL, XMR
- Adds \`@IsValidWalletAddress(tickerProp)\` class-validator decorator in \`libs/backend/be-commons/src/decorators/\` — reads ticker from a sibling DTO property at validation time
- Applies decorator to \`CreateOrderDto.toAddress\` — invalid wallet addresses are now rejected at the NestJS validation pipe before order creation
- Adds Jest config to \`libs/commons\` (was missing — existing spec files were never running)

## Test plan
- [ ] \`npx jest --projects libs/commons\` — all wallet-address tests pass
- [ ] \`POST /change-now/orders\` with a valid BTC address for toCurrency=btc succeeds
- [ ] \`POST /change-now/orders\` with an ETH address for toCurrency=btc returns 400 with validation error
- [ ] \`POST /change-now/orders\` with a garbage toAddress returns 400

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
