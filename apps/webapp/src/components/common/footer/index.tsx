'use client';

import { cn } from '@workspace/utils';

type AppFooterProps = {};

const AppFooter = ({}: AppFooterProps) => {
  return (
    <footer className="sticky bottom-0 mt-2 rounded-xl bg-white/90 px-4 py-2 text-center text-xs text-slate-500">
        <p className="mt-1.5 text-sm text-slate-500">
          Non-custodial · No registration · Powered by ChangeNow
        </p>
    </footer>
  );
};

export { AppFooter };
