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
import { Button } from '@workspace/ui/button';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';

export type CoinSelectorProps = {
  label: string;
  value: CurrencyDto | null;
  options: CurrencyDto[];
  onChange: (currency: CurrencyDto) => void;
  disabled?: boolean;
};

export function CoinSelector({ label, value, options, onChange, disabled }: CoinSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-auto w-full justify-between rounded-xl border-slate-200 bg-white px-4 py-3 font-medium shadow-sm transition-all hover:border-indigo-300 hover:shadow-indigo-50',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {value ? (
              <span className="flex items-center gap-3">
                {value.image ? (
                  <img src={value.image} alt={value.ticker} className="h-8 w-8 rounded-full shadow-sm" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {value.ticker.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-slate-800">{value.ticker.toUpperCase()}</span>
                  <Badge variant="secondary" className="mt-0.5 px-1.5 py-0 text-[10px]">
                    {value.network.toUpperCase()}
                  </Badge>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <ChevronDown size={14} className="text-slate-400" />
                </span>
                <span className="text-slate-400">Select coin</span>
              </span>
            )}
            <ChevronDown size={16} className="text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white p-0" align="start">
          <Command>
            <CommandInput placeholder="Search coin..." className="h-11" />
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandEmpty>No coins found.</CommandEmpty>
              <CommandGroup>
                {options.map((coin) => (
                  <CommandItem
                    key={`${coin.ticker}-${coin.network}`}
                    value={`${coin.ticker} ${coin.name} ${coin.network}`}
                    onSelect={() => {
                      onChange(coin);
                      setOpen(false);
                    }}
                    className="px-3 py-2.5"
                  >
                    <span className="flex flex-1 items-center gap-3">
                      {coin.image ? (
                        <img src={coin.image} alt={coin.ticker} className="h-8 w-8 rounded-full" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                          {coin.ticker.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{coin.ticker.toUpperCase()}</span>
                        <span className="text-xs text-slate-400">{coin.name}</span>
                      </span>
                      <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px]">
                        {coin.network.toUpperCase()}
                      </Badge>
                    </span>
                    {value?.ticker === coin.ticker && value?.network === coin.network && (
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
  );
}
