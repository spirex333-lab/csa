import * as React from 'react';
import { Badge as UiBadge } from '@workspace/ui/badge';
import { cn } from '@workspace/utils';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'neutral';

const STATUS_CLASSES: Record<BadgeStatus, string> = {
  success: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  error: 'border-transparent bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  neutral: 'border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: BadgeStatus;
}

export function Badge({ status = 'neutral', className, ...props }: BadgeProps) {
  return (
    <UiBadge
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_CLASSES[status],
        className
      )}
      {...props}
    />
  );
}
