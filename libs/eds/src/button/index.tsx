import * as React from 'react';
import { Button as UiButton } from '@workspace/ui';
import { cn } from '@workspace/utils';

type ButtonVariant = 'default' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ComponentProps<typeof UiButton> {
  variant?: ButtonVariant;
}

const mapVariant = (variant?: ButtonVariant) => {
  if (variant === 'secondary') return 'secondary';
  if (variant === 'ghost') return 'ghost';
  return 'default';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <UiButton
      ref={ref}
      variant={mapVariant(variant) as any}
      className={cn('h-12 rounded-2xl px-6 text-sm font-semibold', className)}
      {...props}
    />
  )
);

Button.displayName = 'EdsButton';

export { Button };
