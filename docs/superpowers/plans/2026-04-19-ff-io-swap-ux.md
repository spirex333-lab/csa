# FF.io-Style Swap UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the swap page layout to match ff.io's UX wireframe — horizontal side-by-side panels with inline amount+coin selector, rate toggle as tab buttons beside the CTA, and destination below both panels.

**Architecture:** Create a new `SwapPanel` composite component in `libs/eds/src/swap/` that combines the amount input and coin selector in a single horizontal row. Update `libs/eds/src/swap/coin-selector.tsx` to support a compact inline variant. Rewrite the swap page layout in `apps/webapp/src/app/[lang]/(auth)/swap/page.tsx` to use the horizontal two-column structure.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, react-hook-form, existing EDS components (`CoinSelector`, `AmountInput`, `RateToggle`, `RateDisplay`)

---

### Task 1: Create `SwapPanel` composite component

**Files:**
- Create: `libs/eds/src/swap/swap-panel.tsx`
- Modify: `libs/eds/src/swap/index.ts`

- [ ] **Step 1: Create `swap-panel.tsx`**

This component renders one side of the swap (Send or Receive). It shows the label, a large amount input on the left, and the coin selector button on the right — all in one bordered box. The coin selector trigger is compact (just icon + ticker + chevron, no full button height).

```tsx
'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@workspace/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/command';
import { Check } from 'lucide-react';
import { Badge } from '@workspace/ui/badge';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';

export type SwapPanelProps = {
  label: string;
  amount: string;
  onAmountChange?: (v: string) => void;
  readOnly?: boolean;
  loading?: boolean;
  amountError?: string;
  currency: CurrencyDto | null;
  currencies: CurrencyDto[];
  onCurrencyChange: (c: CurrencyDto) => void;
  /** Sub-label shown below the panel (e.g. rate info) */
  subLabel?: React.ReactNode;
};

export function SwapPanel({
  label,
  amount,
  onAmountChange,
  readOnly,
  loading,
  amountError,
  currency,
  currencies,
  onCurrencyChange,
  subLabel,
}: SwapPanelProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>

      {/* Main input box */}
      <div
        className={cn(
          'flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 gap-3 transition-colors focus-within:border-indigo-400 focus-within:bg-white',
          amountError && 'border-red-400 focus-within:border-red-400'
        )}
      >
        {/* Amount */}
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          placeholder="0.00"
          className={cn(
            'min-w-0 flex-1 bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-300 placeholder:font-normal',
            readOnly && 'cursor-default text-indigo-600',
            loading && 'text-transparent'
          )}
        />
        {loading && (
          <span className="flex items-center">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          </span>
        )}

        {/* Divider */}
        <div className="h-8 w-px shrink-0 bg-slate-200" />

        {/* Coin picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-slate-200/60"
            >
              {currency ? (
                <>
                  {currency.image ? (
                    <img
                      src={currency.image}
                      alt={currency.ticker}
                      className="h-7 w-7 rounded-full shadow-sm"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {currency.ticker.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold text-slate-800">
                      {currency.ticker.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {currency.network.toUpperCase()}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-400">
                  Select
                </span>
              )}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white p-0" align="end">
            <Command>
              <CommandInput placeholder="Search coin..." className="h-11" />
              <CommandList className="max-h-64 overflow-y-auto">
                <CommandEmpty>No coins found.</CommandEmpty>
                <CommandGroup>
                  {currencies.map((coin) => (
                    <CommandItem
                      key={`${coin.ticker}-${coin.network}`}
                      value={`${coin.ticker} ${coin.name} ${coin.network}`}
                      onSelect={() => {
                        onCurrencyChange(coin);
                        setOpen(false);
                      }}
                      className="px-3 py-2.5"
                    >
                      <span className="flex flex-1 items-center gap-3">
                        {coin.image ? (
                          <img
                            src={coin.image}
                            alt={coin.ticker}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                            {coin.ticker.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">
                            {coin.ticker.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">
                            {coin.name}
                          </span>
                        </span>
                        <Badge
                          variant="secondary"
                          className="ml-auto px-1.5 py-0 text-[10px]"
                        >
                          {coin.network.toUpperCase()}
                        </Badge>
                      </span>
                      {currency?.ticker === coin.ticker &&
                        currency?.network === coin.network && (
                          <Check size={14} className="ml-2 text-indigo-500" />
                        )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {amountError && (
        <p className="text-xs text-red-500">{amountError}</p>
      )}
      {subLabel && (
        <div className="text-xs text-slate-400">{subLabel}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Export from `libs/eds/src/swap/index.ts`**

Add the export line:

```ts
export * from './coin-selector';
export * from './amount-input';
export * from './rate-display';
export * from './rate-toggle';
export * from './min-max-warning';
export * from './swap-panel';
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/arunsharma/projects/csa && npx tsc -p libs/eds/tsconfig.json --noEmit 2>&1 | head -40
```

Expected: no errors related to `swap-panel.tsx`.

- [ ] **Step 4: Commit**

```bash
git add libs/eds/src/swap/swap-panel.tsx libs/eds/src/swap/index.ts
git commit -m "feat(eds): add SwapPanel composite component for horizontal ff.io-style layout"
```

---

### Task 2: Rewrite swap page layout to ff.io horizontal UX

**Files:**
- Modify: `apps/webapp/src/app/[lang]/(auth)/swap/page.tsx`

The new layout structure:
1. Hero text (centered, full width)
2. **Two-column row**: `[SwapPanel: Send]` `[⇄ button]` `[SwapPanel: Receive]`
3. **Destination address** — full-width input below
4. **Bottom bar**: `[Fixed rate btn]` `[Float rate btn]` `[?]` ... `[Exchange Now →]`

Rate info (1 BTC ≈ X USDT) renders as `subLabel` on the Send panel.

- [ ] **Step 1: Rewrite `swap/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftRight, HelpCircle } from 'lucide-react';
import { useSwapForm } from '@workspace/commons/hooks/useSwapForm';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { SwapPanel, RateDisplay } from '@workspace/eds/swap';
import { Button } from '@workspace/eds';
import { Input } from '@workspace/eds';
import { RateType } from '@workspace/commons/dtos/change-now/create-order.dto';

export default function SwapPage() {
  const {
    form,
    fromCurrency,
    toCurrency,
    rateType,
    quote,
    quoteLoading,
    quoteError,
    setFromCurrency,
    setToCurrency,
    setRateType,
    reversePair,
  } = useSwapForm();

  const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);

  useEffect(() => {
    fetch('/api/swap/currencies')
      .then((r) => r.json())
      .then(setCurrencies)
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const fromAmount = watch('fromAmount');

  const onSubmit = handleSubmit(async (values) => {
    if (!fromCurrency || !toCurrency) return;
    await fetch('/api/swap/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromCurrency: fromCurrency.ticker,
        toCurrency: toCurrency.ticker,
        fromAmount: parseFloat(values.fromAmount),
        toAddress: values.toAddress,
        rateType,
        fromNetwork: fromCurrency.network,
        toNetwork: toCurrency.network,
        rateId: quote?.rateId,
      }),
    });
  });

  const rateSubLabel = (
    <RateDisplay
      quote={quote}
      loading={quoteLoading}
      fromTicker={fromCurrency?.ticker}
      toTicker={toCurrency?.ticker}
    />
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 p-6">
      <div className="w-full max-w-3xl">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Instant Crypto Exchange
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Non-custodial · No registration · Powered by ChangeNow
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-indigo-100/60 ring-1 ring-slate-100">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">

            {/* ── Row 1: Send ⇄ Receive ── */}
            <div className="flex items-start gap-3">
              <SwapPanel
                label="Send"
                amount={fromAmount}
                onAmountChange={(v) => form.setValue('fromAmount', v)}
                amountError={errors.fromAmount?.message}
                currency={fromCurrency}
                currencies={currencies}
                onCurrencyChange={setFromCurrency}
                subLabel={rateSubLabel}
              />

              {/* Swap direction button */}
              <button
                type="button"
                onClick={reversePair}
                aria-label="Reverse pair"
                className="mt-8 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-indigo-400 hover:text-indigo-500"
              >
                <ArrowLeftRight size={16} />
              </button>

              <SwapPanel
                label="Receive"
                amount={quote ? String(quote.toAmount) : ''}
                readOnly
                loading={quoteLoading}
                currency={toCurrency}
                currencies={currencies}
                onCurrencyChange={setToCurrency}
              />
            </div>

            {quoteError && (
              <p className="text-xs text-red-500">{quoteError}</p>
            )}

            {/* ── Row 2: Destination address ── */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Destination address
                {toCurrency && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500">
                    {toCurrency.ticker.toUpperCase()}
                  </span>
                )}
              </label>
              <Input
                placeholder={
                  toCurrency
                    ? `Your ${toCurrency.ticker.toUpperCase()} address`
                    : 'Enter recipient wallet address'
                }
                {...register('toAddress', {
                  required: 'Destination address is required',
                })}
                className={`h-12 rounded-xl px-4 text-sm ${
                  errors.toAddress
                    ? 'border-red-400 focus-visible:ring-red-400'
                    : ''
                }`}
              />
              {errors.toAddress && (
                <p className="text-xs text-red-500">
                  {errors.toAddress.message}
                </p>
              )}
            </div>

            {/* ── Row 3: Rate toggle + CTA ── */}
            <div className="flex items-center gap-2">
              {/* Fixed rate tab */}
              <button
                type="button"
                onClick={() => setRateType(RateType.FIXED)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  rateType === RateType.FIXED
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Fixed rate
                {rateType === RateType.FIXED && quote && (
                  <span className="ml-1.5 font-normal opacity-70">
                    ({((quote.networkFee / quote.fromAmount) * 100).toFixed(1)}%)
                  </span>
                )}
              </button>

              {/* Float rate tab */}
              <button
                type="button"
                onClick={() => setRateType(RateType.FLOAT)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  rateType === RateType.FLOAT
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Float rate
                {rateType === RateType.FLOAT && quote && (
                  <span className="ml-1.5 font-normal opacity-70">
                    ({((quote.networkFee / quote.fromAmount) * 100).toFixed(1)}%)
                  </span>
                )}
              </button>

              {/* Help icon */}
              <button
                type="button"
                aria-label="Rate type info"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              >
                <HelpCircle size={16} />
              </button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* CTA */}
              <Button
                type="submit"
                disabled={
                  isSubmitting || !fromCurrency || !toCurrency || !quote
                }
                className="h-12 rounded-2xl bg-indigo-600 px-8 text-base font-semibold tracking-wide shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-40"
              >
                {isSubmitting ? 'Creating order…' : 'Exchange now →'}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check `QuoteResponseDto` has `networkFee` field**

```bash
grep -n "networkFee" /Users/arunsharma/projects/csa/libs/commons/src/dtos/change-now/quote.dto.ts
```

If `networkFee` is missing, replace the fee percentage spans in both rate tab buttons with nothing (remove the `<span>` blocks). If present, keep as-is.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/arunsharma/projects/csa && npx tsc -p apps/webapp/tsconfig.json --noEmit 2>&1 | head -40
```

Expected: no errors in `swap/page.tsx` or `swap-panel.tsx`.

- [ ] **Step 4: Commit**

```bash
git add apps/webapp/src/app/[lang]/\(auth\)/swap/page.tsx
git commit -m "feat(webapp): redesign swap page to ff.io horizontal UX layout"
```

---

### Task 3: Verify in browser

**Files:** (no changes — verification only)

- [ ] **Step 1: Start the webapp dev server**

```bash
cd /Users/arunsharma/projects/csa && nx serve webapp
```

- [ ] **Step 2: Navigate to the swap page**

Open browser to `http://localhost:4200/en/swap` (or whatever port nx serves on).

- [ ] **Step 3: Check the layout visually**

Confirm:
1. Two panels are side-by-side horizontally (Send on left, Receive on right)
2. The `⇄` swap button sits between them at mid-height
3. Amount and coin selector are inline in one box per panel
4. Destination address is below, full width
5. Rate toggle tabs + Exchange Now button are in one bottom row
6. Page still works on mobile (panels should wrap to column at small viewport — Tailwind `flex-col sm:flex-row` if needed)

- [ ] **Step 4: If panels don't wrap on mobile, apply responsive fix**

In `swap/page.tsx`, change the panels row class from:
```tsx
<div className="flex items-start gap-3">
```
to:
```tsx
<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
```

And hide the swap arrow on mobile (it appears between the panels vertically on mobile which is fine, but re-check visually).

- [ ] **Step 5: Commit any responsive fixes**

```bash
git add apps/webapp/src/app/[lang]/\(auth\)/swap/page.tsx
git commit -m "fix(webapp): make swap panels responsive on mobile"
```
