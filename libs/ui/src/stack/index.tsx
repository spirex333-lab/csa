import { cn } from '@workspace/utils';
import React, { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {};

export function Stack(props: Props) {
  return (
    <div {...props} className={cn('flex flex-col gap-2', props?.className)}>
      {props?.children}
    </div>
  );
}

export function HStack(props: Props) {
  return (
    <div {...props} className={cn('flex items-center gap-2', props?.className)}>
      {props?.children}
    </div>
  );
}
