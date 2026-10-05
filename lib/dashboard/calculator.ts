/**
 * Dashboard financial calculator for the Smart Expense Tracker.
 * Pure functions — no side effects, no React, no browser APIs.
 */
import type { Transaction } from '@/lib/transactions/types';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

/**
 * Calculates the financial summary from a list of transactions.
 *
 * - Sums all INCOME amounts into totalIncome.
 * - Sums all EXPENSE amounts into totalExpenses.
 * - balance = totalIncome - totalExpenses
 * - Returns all zeros for an empty list.
 *
 * @param transactions - Array of persisted Transaction objects.
 * @returns A FinancialSummary with totalIncome, totalExpenses, and balance.
 */
export function calculateSummary(transactions: Transaction[]): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const transaction of transactions) {
    if (transaction.type === 'INCOME') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  }

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}
