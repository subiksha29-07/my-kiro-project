'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navItem = (href: string, label: string, icon: React.ReactNode) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
        isActive(href)
          ? 'bg-violet-600 text-white shadow-sm'
          : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto">

      {/* ── Logo ── */}
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 group"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shrink-0 group-hover:bg-violet-700 transition-colors shadow-sm">
          <span className="text-white font-extrabold text-base leading-none select-none" aria-hidden>
            $
          </span>
        </div>
        <span className="font-extrabold text-slate-900 text-sm leading-tight tracking-tight group-hover:text-violet-600 transition-colors">
          Smart Expense Tracker
        </span>
      </Link>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Sidebar navigation">
        {navItem(
          '/dashboard',
          'Dashboard',
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
            <path d="M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm8 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM1 8a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 1 8Zm4 0a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5 8Zm-4 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm8 0a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" />
          </svg>,
        )}

        {navItem(
          '/transactions',
          'Transactions',
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
            <path fillRule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v2A1.5 1.5 0 0 1 13.5 7h-11A1.5 1.5 0 0 1 1 5.5v-2Zm1.5 0v2h11v-2h-11ZM1 10.5A1.5 1.5 0 0 1 2.5 9h11a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-2Zm1.5 0v2h11v-2h-11Z" clipRule="evenodd" />
          </svg>,
        )}
      </nav>

      {/* ── Bottom: user + logout ── */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-100 space-y-1">
        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50">
          <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-700" aria-hidden>
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-700 truncate">User</p>
            <p className="text-xs text-slate-400 truncate">Free Plan</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          aria-label="Logout"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
            <path fillRule="evenodd" d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
