'use client';

import { useState } from 'react';
import type { BudgetEvaluation } from '@/lib/budget/manager';
import { formatCurrency } from '@/lib/utils/currency';
import BudgetForm from './BudgetForm';
import BudgetProgressBar from './BudgetProgressBar';

interface BudgetWidgetProps {
  evaluation: BudgetEvaluation;
  onBudgetChange: (budget: number) => void;
  error?: string | null;
}

const STATUS_CONFIG = {
  WITHIN_BUDGET: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    label: 'Within Budget',
    dot: 'bg-emerald-500',
  },
  OVER_BUDGET: {
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    label: 'Over Budget',
    dot: 'bg-rose-500',
  },
  NO_BUDGET: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    label: 'No Budget Set',
    dot: 'bg-slate-400',
  },
};

export default function BudgetWidget({ evaluation, onBudgetChange, error }: BudgetWidgetProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { status, monthlyExpenses, budget, remaining, overspend, percentage } = evaluation;
  const cfg = STATUS_CONFIG[status];

  function handleBudgetSave(newBudget: number) {
    onBudgetChange(newBudget);
    setShowEditForm(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <circle cx="8" cy="8" r="6.5" stroke="#f59e0b" strokeWidth="1.25" />
              <path d="M8 4.5v3.25L10.5 9.5" stroke="#f59e0b" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Monthly Budget</h2>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs text-rose-700" role="alert">
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path fillRule="evenodd" d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 2.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm0 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* This month's spending */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">This month&apos;s expenses</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatCurrency(monthlyExpenses)}</p>
        </div>

        {/* NO_BUDGET: set budget form */}
        {status === 'NO_BUDGET' && (
          <div className="pt-1">
            <p className="text-sm text-slate-500 mb-3">Set a monthly limit to start tracking your spending progress.</p>
            <BudgetForm currentBudget={null} onSave={handleBudgetSave} />
          </div>
        )}

        {/* WITHIN_BUDGET */}
        {status === 'WITHIN_BUDGET' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400 mb-0.5">Budget</p>
                <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatCurrency(budget!)}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
                <p className="text-xs text-emerald-600 mb-0.5">Remaining</p>
                <p className="text-sm font-semibold text-emerald-700 tabular-nums">{formatCurrency(remaining!)}</p>
              </div>
            </div>
            <BudgetProgressBar percentage={percentage} status={status} />
            <button
              type="button"
              onClick={() => setShowEditForm((p) => !p)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
            >
              {showEditForm ? '↑ Hide form' : '✎ Edit budget'}
            </button>
            {showEditForm && <BudgetForm currentBudget={budget} onSave={handleBudgetSave} />}
          </div>
        )}

        {/* OVER_BUDGET */}
        {status === 'OVER_BUDGET' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400 mb-0.5">Budget</p>
                <p className="text-sm font-semibold text-slate-800 tabular-nums">{formatCurrency(budget!)}</p>
              </div>
              <div className="rounded-xl bg-rose-50 px-3 py-2.5">
                <p className="text-xs text-rose-500 mb-0.5">Overspend</p>
                <p className="text-sm font-semibold text-rose-700 tabular-nums">{formatCurrency(overspend!)}</p>
              </div>
            </div>
            <BudgetProgressBar percentage={percentage} status={status} />
            <button
              type="button"
              onClick={() => setShowEditForm((p) => !p)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
            >
              {showEditForm ? '↑ Hide form' : '✎ Edit budget'}
            </button>
            {showEditForm && <BudgetForm currentBudget={budget} onSave={handleBudgetSave} />}
          </div>
        )}
      </div>
    </div>
  );
}
