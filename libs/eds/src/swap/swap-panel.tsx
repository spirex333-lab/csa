'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
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

      <div
        className={cn(
          'flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 gap-3 transition-colors focus-within:border-indigo-400 focus-within:bg-white',
          amountError && 'border-red-400 focus-within:border-red-400'
        )}
      >
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          placeholder="0.00"
          className={cn(
            'min-w-0 flex-1 bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:font-normal placeholder:text-slate-300',
            readOnly && 'cursor-default text-indigo-600',
            loading && 'text-transparent'
          )}
        />
        {loading && (
          <span className="flex items-center">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          </span>
        )}

        <div className="h-8 w-px shrink-0 bg-slate-200" />

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
                    <span className="mt-0.5 text-[10px] text-slate-400">
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

      {amountError && <p className="text-xs text-red-500">{amountError}</p>}
      {subLabel && <div className="text-xs text-slate-400">{subLabel}</div>}
    </div>
  );
}
