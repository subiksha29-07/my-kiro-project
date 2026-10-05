'use client';

import Link from 'next/link';

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-14 text-center"
      role="status"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-indigo-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" fill="currentColor" opacity="0.3" />
          <path d="M11 7h2v6h-2V7Zm0 8h2v2h-2v-2Z" fill="currentColor" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-700">No transactions yet</h2>
      <p className="mt-1.5 text-sm text-slate-400 max-w-xs">
        Start tracking your finances by recording your first income or expense.
      </p>
      <Link
        href="/transactions"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
        </svg>
        Add your first transaction
      </Link>
    </div>
  );
}
