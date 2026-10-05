'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { loadTransactions } from '@/lib/transactions/store';
import { loadBudget, saveBudget } from '@/lib/budget/store';
import { calculateSummary } from '@/lib/dashboard/calculator';
import { evaluateBudget, getCurrentYearMonth } from '@/lib/budget/manager';
import type { Transaction } from '@/lib/transactions/types';
import type { FinancialSummary } from '@/lib/dashboard/calculator';
import type { BudgetEvaluation } from '@/lib/budget/manager';
import { BalanceSummary } from '@/components/dashboard/BalanceSummary';
import { EmptyState } from '@/components/dashboard/EmptyState';
import BudgetWidget from '@/components/budget/BudgetWidget';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [lastGoodSummary, setLastGoodSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [budget, setBudget] = useState<number | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const lastGoodEvaluationRef = useRef<BudgetEvaluation>({
    monthlyExpenses: 0,
    budget: null,
    status: 'NO_BUDGET',
    remaining: null,
    overspend: null,
    percentage: 0,
  });

  useEffect(() => {
    setTransactions(loadTransactions());
    setBudget(loadBudget());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    try {
      const summary = calculateSummary(transactions);
      setLastGoodSummary(summary);
      setSummaryError(null);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to calculate summary.');
    }
  }, [transactions]);

  function handleBudgetChange(newBudget: number) {
    const result = saveBudget(newBudget);
    if (!result.success) {
      setBudgetError('Could not save the budget — storage quota exceeded.');
    } else {
      setBudget(newBudget);
      setBudgetError(null);
    }
  }

  let evaluation: BudgetEvaluation;
  try {
    evaluation = evaluateBudget(transactions, budget, getCurrentYearMonth());
    lastGoodEvaluationRef.current = evaluation;
  } catch {
    evaluation = lastGoodEvaluationRef.current;
  }

  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* ── Page header ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 flex items-end justify-between">
          <div>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">{monthName}</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Add Transaction
          </Link>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {summaryError && (
          <div role="alert" className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
            </svg>
            {summaryError}
          </div>
        )}

        {/* Summary cards */}
        <BalanceSummary summary={lastGoodSummary} isLoading={isLoading} />

        {/* Two-column layout on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <BudgetWidget
              evaluation={evaluation}
              onBudgetChange={handleBudgetChange}
              error={budgetError}
            />
          </div>

          {/* Quick-nav panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/transactions"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                  Add new transaction
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                  <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 11.78a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/transactions"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v2A1.5 1.5 0 0 1 13.5 7h-11A1.5 1.5 0 0 1 1 5.5v-2Zm1.5 0v2h11v-2h-11ZM1 10.5A1.5 1.5 0 0 1 2.5 9h11a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-2Zm1.5 0v2h11v-2h-11Z" clipRule="evenodd" />
                  </svg>
                  View all transactions
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                  <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 11.78a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Transaction count */}
            {!isLoading && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 text-base">{transactions.length}</span>{' '}
                  {transactions.length === 1 ? 'transaction' : 'transactions'} recorded
                </p>
              </div>
            )}
          </div>
        </div>

        {transactions.length === 0 && !isLoading && <EmptyState />}
      </div>
    </div>
  );
}
