'use client';

import Link from 'next/link';
import type { Transaction } from '@/lib/transactions/types';
import { formatCurrency } from '@/lib/utils/currency';

interface MonthlyBreakdownProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

interface MonthRow {
  yearMonth: string;   // 'YYYY-MM'
  label: string;       // 'October 2026'
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

/** Build month rows sorted most-recent-first from a flat transaction list. */
function buildMonthRows(transactions: Transaction[]): MonthRow[] {
  const map = new Map<string, MonthRow>();

  for (const t of transactions) {
    const yearMonth = t.date.slice(0, 7); // 'YYYY-MM'
    if (!map.has(yearMonth)) {
      const [year, month] = yearMonth.split('-').map(Number);
      const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
      map.set(yearMonth, { yearMonth, label, income: 0, expenses: 0, balance: 0, count: 0 });
    }
    const row = map.get(yearMonth)!;
    if (t.type === 'INCOME') {
      row.income += t.amount;
    } else {
      row.expenses += t.amount;
    }
    row.balance = row.income - row.expenses;
    row.count += 1;
  }

  // Sort descending by yearMonth string (lexicographic = chronological for YYYY-MM)
  return Array.from(map.values()).sort((a, b) => (a.yearMonth > b.yearMonth ? -1 : 1));
}

export function MonthlyBreakdown({ transactions, isLoading = false }: MonthlyBreakdownProps) {
  const rows = buildMonthRows(transactions);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-indigo-600">
              <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3A2 2 0 0 1 14 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM3.5 7v5c0 .28.22.5.5.5h8a.5.5 0 0 0 .5-.5V7h-9Zm2 2h2v2h-2V9Zm3 0h2v2H8.5V9Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Monthly Breakdown</h2>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="px-5 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state — no transactions at all */}
      {!isLoading && rows.length === 0 && (
        <div className="px-5 py-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-slate-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600">No transactions yet</p>
          <p className="text-xs text-slate-400 mt-1">Monthly data will appear here once you add transactions.</p>
          <Link
            href="/transactions"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Add your first transaction
          </Link>
        </div>
      )}

      {/* Month rows */}
      {!isLoading && rows.length > 0 && (
        <>
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>Month</span>
            <span className="text-right text-emerald-600">Income</span>
            <span className="text-right text-rose-500">Expenses</span>
            <span className="text-right">Balance</span>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div
                key={row.yearMonth}
                className="grid grid-cols-4 gap-2 px-5 py-3.5 items-center hover:bg-slate-50/60 transition-colors"
              >
                {/* Month label + transaction count */}
                <div>
                  <p className="text-sm font-medium text-slate-700">{row.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {row.count} {row.count === 1 ? 'entry' : 'entries'}
                  </p>
                </div>

                {/* Income */}
                <p className="text-sm font-medium text-emerald-600 text-right tabular-nums">
                  {formatCurrency(row.income)}
                </p>

                {/* Expenses */}
                <p className="text-sm font-medium text-rose-500 text-right tabular-nums">
                  {formatCurrency(row.expenses)}
                </p>

                {/* Balance */}
                <p
                  className={`text-sm font-semibold text-right tabular-nums ${
                    row.balance >= 0 ? 'text-indigo-600' : 'text-rose-600'
                  }`}
                >
                  {formatCurrency(row.balance)}
                </p>
              </div>
            ))}
          </div>

          {/* Footer: totals row */}
          {rows.length > 1 && (() => {
            const totalIncome   = rows.reduce((s, r) => s + r.income,   0);
            const totalExpenses = rows.reduce((s, r) => s + r.expenses, 0);
            const totalBalance  = totalIncome - totalExpenses;
            return (
              <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <span>All time</span>
                <span className="text-right text-emerald-700 tabular-nums">{formatCurrency(totalIncome)}</span>
                <span className="text-right text-rose-600  tabular-nums">{formatCurrency(totalExpenses)}</span>
                <span className={`text-right tabular-nums ${totalBalance >= 0 ? 'text-indigo-700' : 'text-rose-700'}`}>
                  {formatCurrency(totalBalance)}
                </span>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
