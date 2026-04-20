import * as React from 'react';
import { cn } from '@workspace/utils';

export interface SpinnerProps {
  variant?: 'inline' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

function SpinnerIcon({ size = 'md', className }: Pick<SpinnerProps, 'size' | 'className'>) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-indigo-400 border-t-transparent',
        SIZE_CLASSES[size!],
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
}

export function Spinner({ variant = 'inline', size = 'md', className }: SpinnerProps) {
  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
        <SpinnerIcon size={size} className={className} />
      </div>
    );
  }
  return <SpinnerIcon size={size} className={className} />;
}
