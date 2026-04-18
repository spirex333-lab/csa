'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, LayoutDashboard, ArrowLeftRight, History, Users, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@workspace/utils';
import { getUser, logout } from '@workspace/commons/auth';

type NavItem = {
  label: string;
  icon: React.ReactNode;
  path: string; // locale-relative path, e.g. '/workflows'
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '' },
  { label: 'Swap', icon: <ArrowLeftRight size={18} />, path: '/swap' },
  { label: 'History', icon: <History size={18} />, path: '/history', disabled: true },
  { label: 'Members', icon: <Users size={18} />, path: '/members', disabled: true },
  { label: 'Settings', icon: <Settings size={18} />, path: '/settings', disabled: true },
];

type SideNavProps = {
  open: boolean;
  onClose: () => void;
};

export const SideNav = ({ open, onClose }: SideNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Derive locale prefix from current pathname (e.g. "/en", "/fr")
  const localePrefix = pathname?.match(/^(\/[a-z]{2})(\/|$)/)?.[1] ?? '/en';

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        id="main-nav"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={20} className="text-indigo-400" />
            <span className="text-sm font-semibold tracking-tight">Crypto Swap App</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const href = `${localePrefix}${item.path}`;
            const isActive =
              pathname === href ||
              (item.path !== '' && pathname?.startsWith(href));
            return (
              <button
                key={item.label}
                onClick={() => !item.disabled && navigate(href)}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  item.disabled && 'cursor-not-allowed opacity-40'
                )}
              >
                {item.icon}
                {item.label}
                {item.disabled && (
                  <span className="ml-auto rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-slate-700 p-3">
          <div className="mb-2 flex items-center gap-2 px-3 py-2">
            <User size={16} className="shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-200">
                {user?.email ?? 'User'}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                {user?.workspace ?? 'default-workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout(() => router.refresh())}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
