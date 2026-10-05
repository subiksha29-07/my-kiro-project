'use client';

import { formatCurrency } from '@/lib/utils/currency';

export interface SummaryCardProps {
  label: string;
  value: number;
  variant: 'income' | 'expense' | 'balance';
  isLoading?: boolean;
}

const CONFIG = {
  income: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-500',
    label: 'text-emerald-700',
    value: 'text-emerald-700',
    icon: (
      <svg viewBox="0 0 16 16" fill="white" className="w-4 h-4">
        <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
      </svg>
    ),
  },
  expense: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconBg: 'bg-rose-500',
    label: 'text-rose-700',
    value: 'text-rose-700',
    icon: (
      <svg viewBox="0 0 16 16" fill="white" className="w-4 h-4">
        <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06L7.25 11.44V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  balance: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-500',
    label: 'text-indigo-700',
    value: 'text-indigo-700',
    icon: (
      <svg viewBox="0 0 16 16" fill="white" className="w-4 h-4">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.255-.414.384-.833.384-1.253 0-.41-.123-.827-.368-1.249a3.96 3.96 0 0 0-1.154-.68ZM8.5 12.89c.347.51.886.903 1.619 1.18V12.11c-.34.14-.64.34-.894.59-.473.46-.725.948-.725 1.19Z" />
        <path fillRule="evenodd" d="M9.25 3.5a.75.75 0 0 1 1.5 0V4c1.147.113 2.19.667 2.888 1.538l-1.21.907A2.28 2.28 0 0 0 11 5.625V7.87a4.97 4.97 0 0 1 1.816 1.1c.59.552.934 1.207.934 1.902 0 .697-.345 1.352-.934 1.903A4.97 4.97 0 0 1 11 13.876v2.374a.75.75 0 0 1-1.5 0v-2.264c-1.188-.256-2.14-.9-2.725-1.806l1.222-.88c.378.528.955.905 1.503 1.065v-2.385a4.97 4.97 0 0 1-1.816-1.1C7.095 8.33 6.75 7.675 6.75 6.98c0-.697.345-1.352.934-1.903A4.97 4.97 0 0 1 9.25 3.876V3.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export function SummaryCard({ label, value, variant, isLoading = false }: SummaryCardProps) {
  // For balance, use red when negative
  const isNegativeBalance = variant === 'balance' && value < 0;
  const cfg = CONFIG[variant];

  const valueCls = isNegativeBalance ? 'text-rose-600' : cfg.value;
  const iconBgCls = isNegativeBalance ? 'bg-rose-500' : cfg.iconBg;

  return (
    <div
      className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-5 overflow-hidden`}
      role="region"
      aria-label={label}
    >
      {/* subtle background circle */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/40 pointer-events-none" aria-hidden />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wider ${cfg.label} opacity-70`}>{label}</p>
          {isLoading ? (
            <div
              className="mt-3 h-8 w-32 rounded-lg bg-current opacity-15 animate-pulse"
              aria-busy="true"
              aria-label={`Loading ${label}`}
            />
          ) : (
            <p className={`mt-1.5 text-2xl font-bold tabular-nums ${valueCls}`} aria-live="polite">
              {formatCurrency(value)}
            </p>
          )}
        </div>
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${iconBgCls} flex items-center justify-center shadow-sm`}>
          {cfg.icon}
        </div>
      </div>
    </div>
  );
}
