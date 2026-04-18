import * as React from 'react';
import { Switch as UiSwitch } from '@workspace/ui';
import { cn } from '@workspace/utils';

type SwitchProps = React.ComponentProps<typeof UiSwitch>;

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <UiSwitch
      ref={ref as any}
      className={cn('data-[state=checked]:bg-black', className)}
      {...props}
    />
  )
);

Switch.displayName = 'EdsSwitch';

export { Switch };
export type { SwitchProps };
