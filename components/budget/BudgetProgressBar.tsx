'use client';

import type { BudgetStatus } from '@/lib/budget/manager';

interface BudgetProgressBarProps {
  percentage: number;
  status: BudgetStatus;
}

export default function BudgetProgressBar({ percentage, status }: BudgetProgressBarProps) {
  if (status === 'NO_BUDGET') return null;

  const fillWidth = Math.min(percentage, 100);
  const label = Math.floor(percentage);

  const trackCls = 'bg-slate-100';
  let fillCls: string;
  let textCls: string;
  if (percentage <= 75) {
    fillCls = 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    textCls = 'text-emerald-700';
  } else if (percentage <= 100) {
    fillCls = 'bg-gradient-to-r from-amber-400 to-amber-500';
    textCls = 'text-amber-700';
  } else {
    fillCls = 'bg-gradient-to-r from-rose-500 to-rose-600';
    textCls = 'text-rose-700';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <div className={`flex-1 overflow-hidden rounded-full ${trackCls} h-2.5`}>
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${fillCls}`}
            style={{ width: `${fillWidth}%` }}
            role="progressbar"
            aria-valuenow={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Budget used: ${label}%`}
          />
        </div>
        <span className={`text-sm font-bold tabular-nums w-12 text-right ${textCls}`}>
          {label}%
        </span>
      </div>
    </div>
  );
}
