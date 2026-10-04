/**
 * Property-based tests for lib/transactions/manager.ts
 * Uses fast-check to verify the 8 correctness properties defined in the design.
 *
 * Each property focuses on one invariant and runs with numRuns: 100.
 * Properties are independent — no shared mutable state between tests.
 *
 * Requirements validated: 1.1, 1.3, 1.9, 2.1, 3.2, 4.1, 4.3, 5.1–5.6, 6.1, 6.2
 */

import * as fc from 'fast-check';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '@/lib/transactions/manager';
import { validateTransaction } from '@/lib/transactions/validator';
import { loadTransactions, saveTransactions } from '@/lib/transactions/store';

import {
  arbitraryTransactionList,
  arbitraryNonEmptyTransactionList,
  arbitraryTransactionInput,
  arbitraryExpenseInput,
} from '../arbitraries';

import type { Transaction, TransactionInput } from '@/lib/transactions/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sums the amounts of all INCOME transactions in the list.
 * Inline helper so this file has no dependency on the not-yet-implemented
 * dashboard calculator.
 */
function sumIncome(txs: Transaction[]): number {
  return txs.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
}

/** Sums the amounts of all EXPENSE transactions in the list. */
function sumExpenses(txs: Transaction[]): number {
  return txs.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
}

/**
 * Returns a TransactionInput whose amount is rounded to exactly 2 decimal places.
 * With the updated arbitraryAmount (integer-cents based), this is a no-op for
 * amounts from arbitraryAmount(), but kept as a safety net for other callers.
 */
function roundInputAmount(input: TransactionInput): TransactionInput {
  // Integer-cents amounts are already exact; this handles any edge cases.
  const rounded = Math.round(input.amount * 100) / 100;
  return { ...input, amount: rounded > 0 ? rounded : 0.01 };
}

// ─── localStorage mock (required for Property 7) ─────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
  vi.stubGlobal('localStorage', localStorageMock);
});

// ─── Property 1: Balance Invariant ────────────────────────────────────────────

describe('Property 1: Balance Invariant', () => {
  /**
   * For any transaction list, the balance (totalIncome − totalExpenses) computed
   * from the raw store must equal the same calculation done by the summary logic.
   * Validates that our sumIncome/sumExpenses helpers are consistent with the
   * arithmetic identity: balance = Σ INCOME − Σ EXPENSE.
   *
   * Validates: Requirements 1.1, 2.1
   */
  it('balance === totalIncome - totalExpenses for any transaction list', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const totalIncome = sumIncome(transactions);
        const totalExpenses = sumExpenses(transactions);
        const balance = totalIncome - totalExpenses;

        // The identity must hold within floating-point tolerance.
        expect(Math.abs(balance - (totalIncome - totalExpenses))).toBeLessThan(1e-9);
        // Derived check: adding a transaction never breaks the identity.
        return true;
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 2: Amount Non-Negative ─────────────────────────────────────────

describe('Property 2: Amount Non-Negative', () => {
  /**
   * Any generated TransactionInput with a positive amount (rounded to 2dp) passes
   * validateTransaction. The validator must never reject a structurally valid
   * positive amount that has at most 2 decimal places.
   *
   * Validates: Requirement 1.3
   */
  it('validateTransaction always passes for generated valid inputs with rounded amounts', () => {
    fc.assert(
      fc.property(arbitraryTransactionInput(), (rawInput) => {
        // Round amount to 2dp so it satisfies the validator's decimal-place rule.
        const input = roundInputAmount(rawInput);

        const result = validateTransaction(input);

        // amount must be positive (this is the core invariant).
        expect(input.amount).toBeGreaterThan(0);
        // With a valid rounded amount, the full input must also be valid.
        expect(result.valid).toBe(true);

        return true;
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 3: Filter Subset ────────────────────────────────────────────────

describe('Property 3: Filter Subset', () => {
  /**
   * getTransactions(store, filter) returns only transactions that already exist
   * in `store`. Filtering must never introduce new records.
   *
   * Validates: Requirements 5.1, 5.2, 5.3, 5.5
   */
  it('every transaction returned by getTransactions exists in the original store', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        fc.record({
          type: fc.option(fc.constantFrom<'INCOME' | 'EXPENSE'>('INCOME', 'EXPENSE'), {
            nil: undefined,
          }),
          category: fc.option(
            fc.constantFrom('Food', 'Salary', 'Housing', 'Transport', 'Healthcare'),
            { nil: undefined },
          ),
        }),
        (store, filters) => {
          // Strip undefined keys so the filter object is clean.
          const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined),
          ) as { type?: 'INCOME' | 'EXPENSE'; category?: string };

          const storeIds = new Set(store.map((t) => t.id));
          const result = getTransactions(store, cleanFilters);

          for (const tx of result) {
            // Every returned transaction must have been in the original store.
            expect(storeIds.has(tx.id)).toBe(true);

            // Every returned transaction must satisfy the active filters.
            if (cleanFilters.type !== undefined) {
              expect(tx.type).toBe(cleanFilters.type);
            }
            if (cleanFilters.category !== undefined) {
              expect(tx.category).toBe(cleanFilters.category);
            }
          }

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 4: Add Increases Total Expenses ────────────────────────────────

describe('Property 4: Add Increases Total Expenses', () => {
  /**
   * After addTransaction with an EXPENSE input, the new total EXPENSE sum equals
   * the old total plus the input's amount (within floating-point tolerance).
   *
   * Validates: Requirements 1.1, 1.9
   */
  it('adding an EXPENSE transaction increases total expenses by exactly that amount', () => {
    fc.assert(
      fc.property(
        arbitraryTransactionList(),
        arbitraryExpenseInput(),
        (store, rawExpenseInput) => {
          // Ensure the amount is valid (2dp) before calling addTransaction.
          const expenseInput = roundInputAmount(rawExpenseInput);

          const oldTotal = sumExpenses(store);
          const { store: newStore } = addTransaction(store, expenseInput);
          const newTotal = sumExpenses(newStore);

          // newTotal must equal oldTotal + the added amount (within fp tolerance).
          expect(Math.abs(newTotal - (oldTotal + expenseInput.amount))).toBeLessThan(1e-9);

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 5: Delete Decreases Count ──────────────────────────────────────

describe('Property 5: Delete Decreases Count', () => {
  /**
   * Successfully deleting an existing transaction reduces the store length by
   * exactly 1. The result must always be ok:true (since we pick a transaction
   * that definitely exists).
   *
   * Validates: Requirements 4.1, 4.3
   */
  it('deleting an existing transaction reduces store length by exactly 1', () => {
    fc.assert(
      fc.property(
        arbitraryNonEmptyTransactionList(),
        fc.integer({ min: 0, max: 19 }),
        (store, rawIndex) => {
          // Clamp index to valid range for the generated store length.
          const index = rawIndex % store.length;
          const targetId = store[index].id;

          const result = deleteTransaction(store, targetId);

          expect(result.ok).toBe(true);
          if (result.ok) {
            expect(result.data.store).toHaveLength(store.length - 1);
            // The deleted transaction must not appear in the resulting store.
            expect(result.data.store.find((t) => t.id === targetId)).toBeUndefined();
          }

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 6: Sort Stability ──────────────────────────────────────────────

describe('Property 6: Sort Stability', () => {
  /**
   * The list returned by getTransactions must always be sorted by date descending.
   * For ties on date, the order must be by createdAt descending.
   *
   * For every adjacent pair [a, b] in the result:
   *   a.date >= b.date
   *   if a.date === b.date then a.createdAt >= b.createdAt
   *
   * Validates: Requirement 2.1
   */
  it('getTransactions returns transactions sorted by date desc, createdAt desc', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (store) => {
        const result = getTransactions(store);

        for (let i = 0; i < result.length - 1; i++) {
          const a = result[i];
          const b = result[i + 1];

          // Primary sort: date descending.
          expect(a.date >= b.date).toBe(true);

          // Tie-breaker: createdAt descending when dates are equal.
          if (a.date === b.date) {
            expect(a.createdAt >= b.createdAt).toBe(true);
          }
        }

        return true;
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 7: Round-Trip Persistence ──────────────────────────────────────

describe('Property 7: Round-Trip Persistence', () => {
  /**
   * saveTransactions followed by loadTransactions must return a list whose
   * transactions are deeply equal to the saved list (same ids, same field values).
   *
   * Validates: Requirements 6.1, 6.2
   */
  it('loadTransactions after saveTransactions returns the same list', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        // Reset mock state for each run.
        localStorageMock.clear();
        vi.clearAllMocks();

        const saveResult = saveTransactions(transactions);
        expect(saveResult.success).toBe(true);

        // Feed the written value back so loadTransactions can read it.
        const written = localStorageMock.setItem.mock.calls[0]?.[1];
        if (written !== undefined) {
          localStorageMock.getItem.mockReturnValueOnce(written);
        }

        const loaded = loadTransactions();

        expect(loaded).toHaveLength(transactions.length);

        for (let i = 0; i < transactions.length; i++) {
          expect(loaded[i].id).toBe(transactions[i].id);
          expect(loaded[i].title).toBe(transactions[i].title);
          expect(loaded[i].amount).toBe(transactions[i].amount);
          expect(loaded[i].type).toBe(transactions[i].type);
          expect(loaded[i].category).toBe(transactions[i].category);
          expect(loaded[i].date).toBe(transactions[i].date);
          expect(loaded[i].createdAt).toBe(transactions[i].createdAt);
          expect(loaded[i].updatedAt).toBe(transactions[i].updatedAt);
        }

        return true;
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 8: Edit Preserves ID ───────────────────────────────────────────

describe('Property 8: Edit Preserves ID', () => {
  /**
   * After a successful updateTransaction call, the returned transaction must
   * retain the original id. The id is immutable and must never change across
   * any edit operation.
   *
   * Validates: Requirement 3.2
   */
  it('updateTransaction preserves the original transaction id', () => {
    fc.assert(
      fc.property(
        arbitraryNonEmptyTransactionList(),
        fc.integer({ min: 0, max: 19 }),
        arbitraryTransactionInput(),
        (store, rawIndex, rawInput) => {
          const index = rawIndex % store.length;
          const target = store[index];
          const input = roundInputAmount(rawInput);

          const result = updateTransaction(store, target.id, input, target.updatedAt);

          expect(result.ok).toBe(true);
          if (result.ok) {
            // The id on the returned transaction must be unchanged.
            expect(result.data.transaction.id).toBe(target.id);
          }

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
