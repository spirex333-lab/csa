'use client';


import { cn } from '@workspace/utils';

type AppHeaderProps = {

};

const AppHeader = ({

}: AppHeaderProps) => {
  return (
    <header className={cn('sticky top-0 z-30 flex w-full items-center justify-between bg-[var(--home-surface)] py-4')}>

    </header>
  );
};

export { AppHeader };
