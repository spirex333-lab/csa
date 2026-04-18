import * as React from 'react';
import { Input as UiInput } from '@workspace/ui';
import { cn } from '@workspace/utils';

export type InputProps = React.ComponentProps<typeof UiInput>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <UiInput
        ref={ref}
        className={cn(
          'h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'EdsInput';
