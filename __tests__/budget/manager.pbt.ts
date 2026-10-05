/**
 * Property-based tests for lib/budget/manager.ts
 * Uses fast-check with numRuns: 100 per property.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeMonthlyExpenses, evaluateBudget } from '@/lib/budget/manager';
import type { Transaction } from '@/lib/transactions/types';
import {
  arbitraryTransactionList,
  arbitraryYearMonth,
  arbitraryBudget,
  arbitraryAmount,
  arbitraryDateInMonth,
  arbitraryDateNotInMonth,
  arbitraryTransaction,
} from '@/__tests__/arbitraries';

describe('Property-based tests: computeMonthlyExpenses and evaluateBudget', () => {

  it('Property 1: monthlyExpenses is always >= 0', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth(),
        (transactions, yearMonth) => {
          const result = computeMonthlyExpenses(transactions, yearMonth);
          expect(result).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: status === WITHIN_BUDGET iff monthlyExpenses <= budget', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth(),
        arbitraryBudget(),
        (transactions, yearMonth, budget) => {
          const result = evaluateBudget(transactions, budget, yearMonth);
          expect(result.status === 'WITHIN_BUDGET').toBe(result.monthlyExpenses <= budget);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: remaining is non-negative when WITHIN_BUDGET', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth(),
        arbitraryBudget(),
        (transactions, yearMonth, budget) => {
          const result = evaluateBudget(transactions, budget, yearMonth);
          if (result.status === 'WITHIN_BUDGET') {
            expect(result.remaining).not.toBeNull();
            expect(result.remaining!).toBeGreaterThanOrEqual(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: overspend is non-negative when OVER_BUDGET', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth(),
        arbitraryBudget(),
        (transactions, yearMonth, budget) => {
          const result = evaluateBudget(transactions, budget, yearMonth);
          if (result.status === 'OVER_BUDGET') {
            expect(result.overspend).not.toBeNull();
            expect(result.overspend!).toBeGreaterThanOrEqual(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: percentage is >= 0 and visual fill (Math.min(p,100)) is <= 100', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth(),
        arbitraryBudget(),
        (transactions, yearMonth, budget) => {
          const result = evaluateBudget(transactions, budget, yearMonth);
          expect(result.percentage).toBeGreaterThanOrEqual(0);
          expect(Math.min(result.percentage, 100)).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: adding an EXPENSE in yearMonth increases the total by that amount', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryAmount(),
        arbitraryYearMonth().chain((yearMonth) =>
          fc.tuple(fc.constant(yearMonth), arbitraryDateInMonth(yearMonth))
        ),
        (transactions, amount, [yearMonth, dateInMonth]) => {
          const newExpense: Transaction = {
            id: 'pbt-new-expense',
            title: 'PBT Expense',
            amount,
            type: 'EXPENSE',
            category: 'Food',
            date: dateInMonth,
            createdAt: '2020-01-01T00:00:00.000Z',
            updatedAt: '2020-01-01T00:00:00.000Z',
          };

          const oldTotal = computeMonthlyExpenses(transactions, yearMonth);
          const newTransactions = [...transactions, newExpense];
          const newTotal = computeMonthlyExpenses(newTransactions, yearMonth);

          expect(Math.abs(newTotal - (oldTotal + amount))).toBeLessThan(1e-9);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: transactions with dates outside yearMonth do not contribute to monthly expenses', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryYearMonth().chain((yearMonth) =>
          fc.tuple(fc.constant(yearMonth), arbitraryDateNotInMonth(yearMonth))
        ),
        (transactions, [yearMonth, dateNotInMonth]) => {
          // Replace all dates with a date outside the yearMonth
          const outsideList = transactions.map((t) => ({ ...t, date: dateNotInMonth }));
          // Force type to EXPENSE so we specifically test date exclusion
          const expenseList = outsideList.map((t) => ({ ...t, type: 'EXPENSE' as const }));
          expect(computeMonthlyExpenses(expenseList, yearMonth)).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
