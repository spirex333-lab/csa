'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

export type MinMaxWarningProps = {
  min: number;
  max: number;
  amount: number;
  ticker: string;
};

export function MinMaxWarning({ min, max, amount, ticker }: MinMaxWarningProps) {
  if (amount <= 0) return null;

  const tooLow = amount < min;
  const tooHigh = max > 0 && amount > max;

  if (!tooLow && !tooHigh) return null;

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
      <AlertTriangle size={15} className="shrink-0 text-amber-500" />
      <span>
        {tooLow
          ? <>Min amount is <strong>{min} {ticker.toUpperCase()}</strong></>
          : <>Max amount is <strong>{max} {ticker.toUpperCase()}</strong></>}
      </span>
    </div>
  );
}
