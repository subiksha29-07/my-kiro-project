/**
 * Property-based tests for calculateSummary.
 * Uses fast-check arbitraries from @/__tests__/arbitraries.ts.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateSummary } from '@/lib/dashboard/calculator';
import type { Transaction } from '@/lib/transactions/types';
import {
  arbitraryTransactionList,
  arbitraryAmount,
  arbitraryTransaction,
} from '@/__tests__/arbitraries';

// ─── Helper ──────────────────────────────────────────────────────────────────

function makeTransaction(type: 'INCOME' | 'EXPENSE', amount: number): Transaction {
  return {
    id: crypto.randomUUID(),
    title: 'Test',
    amount,
    type,
    category: type === 'INCOME' ? 'Salary' : 'Food',
    date: '2024-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Property-Based Tests ────────────────────────────────────────────────────

describe('calculateSummary — property-based tests', () => {
  it('Property 1: balance === totalIncome - totalExpenses within 1e-9', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const { totalIncome, totalExpenses, balance } = calculateSummary(transactions);
        expect(Math.abs(balance - (totalIncome - totalExpenses))).toBeLessThan(1e-9);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2: totalIncome >= 0 for any list', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const { totalIncome } = calculateSummary(transactions);
        expect(totalIncome).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 3: totalExpenses >= 0 for any list', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const { totalExpenses } = calculateSummary(transactions);
        expect(totalExpenses).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 4: Adding one INCOME of amount a → newBalance === oldBalance + a', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), arbitraryAmount(), (transactions, amount) => {
        const { balance: oldBalance } = calculateSummary(transactions);
        const newTransactions = [...transactions, makeTransaction('INCOME', amount)];
        const { balance: newBalance } = calculateSummary(newTransactions);
        expect(Math.abs(newBalance - (oldBalance + amount))).toBeLessThan(1e-9);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 5: Adding one EXPENSE of amount a → newBalance === oldBalance - a', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), arbitraryAmount(), (transactions, amount) => {
        const { balance: oldBalance } = calculateSummary(transactions);
        const newTransactions = [...transactions, makeTransaction('EXPENSE', amount)];
        const { balance: newBalance } = calculateSummary(newTransactions);
        expect(Math.abs(newBalance - (oldBalance - amount))).toBeLessThan(1e-9);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 6: Shuffling the list does not change totalIncome, totalExpenses, or balance', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const original = calculateSummary(transactions);
        // Fisher-Yates shuffle on a copy
        const shuffled = [...transactions];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
        }
        const after = calculateSummary(shuffled);
        expect(Math.abs(after.totalIncome - original.totalIncome)).toBeLessThan(1e-9);
        expect(Math.abs(after.totalExpenses - original.totalExpenses)).toBeLessThan(1e-9);
        expect(Math.abs(after.balance - original.balance)).toBeLessThan(1e-9);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 7: calculateSummary([]) always returns all zeros', () => {
    fc.assert(
      fc.property(fc.constant([] as Transaction[]), (empty) => {
        const result = calculateSummary(empty);
        expect(result.totalIncome).toBe(0);
        expect(result.totalExpenses).toBe(0);
        expect(result.balance).toBe(0);
      }),
      { numRuns: 100 },
    );
  });
});
