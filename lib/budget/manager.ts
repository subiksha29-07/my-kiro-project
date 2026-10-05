/**
 * Budget business logic for the Smart Expense Tracker.
 * Pure functions — no localStorage, no React, no side effects.
 */
import type { Transaction } from '@/lib/transactions/types';

export type BudgetStatus = 'WITHIN_BUDGET' | 'OVER_BUDGET' | 'NO_BUDGET';

export interface BudgetEvaluation {
  monthlyExpenses: number;
  budget: number | null;
  status: BudgetStatus;
  remaining: number | null;
  overspend: number | null;
  percentage: number;
}

/**
 * Sums all EXPENSE transactions whose date starts with the given yearMonth string.
 * Transactions with missing or non-string dates are silently excluded.
 *
 * @param transactions - Array of persisted Transaction objects.
 * @param yearMonth - A 'YYYY-MM' string to filter by.
 * @returns Total expense amount for the month, or 0 if none match.
 */
export function computeMonthlyExpenses(transactions: Transaction[], yearMonth: string): number {
  let total = 0;
  for (const t of transactions) {
    if (
      t.type === 'EXPENSE' &&
      typeof t.date === 'string' &&
      t.date.startsWith(yearMonth)
    ) {
      total += t.amount;
    }
  }
  return total;
}

/**
 * Evaluates the current budget status against the monthly expenses.
 *
 * @param transactions - Array of persisted Transaction objects.
 * @param budget - The monthly budget amount (> 0), or null if not set.
 * @param yearMonth - A 'YYYY-MM' string for the month to evaluate.
 * @returns A BudgetEvaluation describing the current budget status.
 */
export function evaluateBudget(
  transactions: Transaction[],
  budget: number | null,
  yearMonth: string
): BudgetEvaluation {
  const monthlyExpenses = computeMonthlyExpenses(transactions, yearMonth);

  if (budget === null) {
    return {
      monthlyExpenses,
      budget: null,
      status: 'NO_BUDGET',
      remaining: null,
      overspend: null,
      percentage: 0,
    };
  }

  // budget is guaranteed > 0 here (store guards against <= 0)
  const percentage = (monthlyExpenses / budget) * 100;

  if (monthlyExpenses <= budget) {
    return {
      monthlyExpenses,
      budget,
      status: 'WITHIN_BUDGET',
      remaining: budget - monthlyExpenses,
      overspend: null,
      percentage,
    };
  }

  // monthlyExpenses > budget
  return {
    monthlyExpenses,
    budget,
    status: 'OVER_BUDGET',
    remaining: null,
    overspend: monthlyExpenses - budget,
    percentage,
  };
}

/**
 * Returns the current year and month as a 'YYYY-MM' string using device local time.
 * Call this at the page/component level and inject the result into evaluateBudget.
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
