import * as React from 'react';
import Link from 'next/link';
import { cn } from '@workspace/utils';

function NextLink({
  className,
  children,
  ...props
}: React.ComponentProps<'a'> & { href: string }) {
  return (
    <Link className={cn('text-blue-500', className)} {...props}>
      {children}
    </Link>
  );
}

export { NextLink };
