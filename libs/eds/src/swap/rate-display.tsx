'use client';

import * as React from 'react';
import { QuoteResponseDto } from '@workspace/commons/dtos/change-now/quote.dto';

export type RateDisplayProps = {
  quote: QuoteResponseDto | null;
  loading: boolean;
  fromTicker?: string;
  toTicker?: string;
};

export function RateDisplay({ quote, loading, fromTicker, toTicker }: RateDisplayProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-sm text-slate-400">
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        Fetching best rate…
      </div>
    );
  }

  if (!quote) {
    return (
      <p className="text-sm text-slate-400">Select coins and enter an amount to see the rate</p>
    );
  }

  const rate = quote.fromAmount > 0 ? (quote.toAmount / quote.fromAmount).toFixed(6) : '—';

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">
        1 {fromTicker?.toUpperCase() ?? '—'} ≈{' '}
        <span className="font-semibold text-slate-800">{rate}</span>{' '}
        {toTicker?.toUpperCase() ?? '—'}
      </span>
      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 ring-1 ring-indigo-100">
        via {quote.provider}
      </span>
    </div>
  );
}
