import {
  Card as UiCard,
} from '@workspace/ui/card';
import { cn } from '@workspace/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/card';

const cardVariants = cva('border-slate-200 bg-white shadow-sm', {
  variants: {
    variant: {
      surface: 'rounded-2xl',
      metric: 'rounded-2xl',
      auth: 'rounded-2xl',
    },
    padding: {
      none: '',
      md: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'surface',
    padding: 'lg',
  },
});

export interface CardProps
  extends React.ComponentPropsWithoutRef<typeof UiCard>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<
  React.ElementRef<typeof UiCard>,
  CardProps
>(({ className, variant, padding, ...props }, ref) => (
  <UiCard
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  />
));
Card.displayName = 'EdsCard';
