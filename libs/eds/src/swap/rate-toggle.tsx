'use client';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/toggle-group';
import { RateType } from '@workspace/commons/dtos/change-now/create-order.dto';

export type RateToggleProps = {
  value: RateType;
  onChange: (value: RateType) => void;
};

export function RateToggle({ value, onChange }: RateToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Rate type</span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as RateType)}
        className="rounded-lg border border-slate-200 bg-slate-50 p-0.5"
      >
        <ToggleGroupItem
          value={RateType.FLOAT}
          className="rounded-md px-4 py-1.5 text-xs font-semibold text-slate-500 transition-all data-[state=on]:bg-indigo-600 data-[state=on]:text-white data-[state=on]:shadow-sm"
        >
          Float
        </ToggleGroupItem>
        <ToggleGroupItem
          value={RateType.FIXED}
          className="rounded-md px-4 py-1.5 text-xs font-semibold text-slate-500 transition-all data-[state=on]:bg-indigo-600 data-[state=on]:text-white data-[state=on]:shadow-sm"
        >
          Fixed
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
