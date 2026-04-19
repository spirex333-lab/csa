'use client';

import * as React from 'react';
import { cn } from '@workspace/utils';
import { Input } from '../input';

export type AmountInputProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  error?: string;
  loading?: boolean;
};

export function AmountInput({ label, value, onChange, readOnly, error, loading }: AmountInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
      <div className="relative">
        <Input
          type="number"
          min="0"
          step="any"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="0.00"
          className={cn(
            'rounded-xl px-4 text-lg font-semibold tracking-tight placeholder:text-slate-300 placeholder:font-normal',
            readOnly && 'cursor-default bg-slate-50 text-indigo-600',
            error && 'border-red-400 focus-visible:ring-red-400',
            loading && 'text-transparent'
          )}
        />
        {loading && (
          <span className="absolute inset-y-0 left-4 flex items-center">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
