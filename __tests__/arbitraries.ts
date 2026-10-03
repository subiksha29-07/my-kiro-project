/**
 * Shared fast-check arbitraries for the Smart Expense Tracker test suite.
 * All property-based test files (*.pbt.ts) import from this module.
 *
 * Import example:
 *   import { arbitraryTransactionList, arbitraryExpenseInput } from '../arbitraries';
 */
import * as fc from 'fast-check';
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from '@/lib/transactions/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

// ─── Primitive Arbitraries ────────────────────────────────────────────────────

/** Generates a valid TransactionType ('INCOME' or 'EXPENSE'). */
export const arbitraryTransactionType = (): fc.Arbitrary<TransactionType> =>
  fc.constantFrom<TransactionType>('INCOME', 'EXPENSE');

/**
 * Generates a valid positive amount.
 * All generated values satisfy the validator rule: > 0, finite, ≤ 1,000,000.
 * Note: fast-check fc.float with these bounds can produce values with more than
 * 2 decimal places; the validator's 2-decimal-place rule is tested separately
 * in the validator unit tests, not via this arbitrary.
 */
export const arbitraryAmount = (): fc.Arbitrary<number> =>
  fc.float({ min: 0.01, max: 1_000_000, noNaN: true, noDefaultInfinity: true });

/**
 * Generates an invalid amount (zero, negative, or non-finite).
 * Used to test that the validator correctly rejects bad amounts.
 */
export const arbitraryInvalidAmount = (): fc.Arbitrary<number> =>
  fc.oneof(
    fc.constant(0),
    fc.float({ max: -0.01, noNaN: true, noDefaultInfinity: true }),
    fc.constant(NaN),
    fc.constant(Infinity),
    fc.constant(-Infinity),
  );

/** Generates a valid category name drawn from the combined category list. */
export const arbitraryCategory = (): fc.Arbitrary<string> =>
  fc.constantFrom(...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES);

/**
 * Generates a valid ISO date string in YYYY-MM-DD format.
 * Range: 2020-01-01 to 2030-12-31 (well within the validator's 1900–2100 window).
 */
export const arbitraryDate = (): fc.Arbitrary<string> =>
  fc
    .date({
      min: new Date('2020-01-01'),
      max: new Date('2030-12-31'),
    })
    .map((d) => d.toISOString().slice(0, 10));

/**
 * Generates a YYYY-MM string suitable for the yearMonth parameter
 * in budget manager functions.
 */
export const arbitraryYearMonth = (): fc.Arbitrary<string> =>
  arbitraryDate().map((d) => d.slice(0, 7));

/**
 * Generates a date string guaranteed to fall within the given yearMonth.
 * Used in budget property tests where we need expenses that are in-scope.
 */
export const arbitraryDateInMonth = (yearMonth: string): fc.Arbitrary<string> => {
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0); // day 0 of next month = last day of this month
  return fc
    .date({ min: firstDay, max: lastDay })
    .map((d) => d.toISOString().slice(0, 10));
};

/**
 * Generates a date string guaranteed NOT to fall within the given yearMonth.
 * Used in budget property tests to verify out-of-scope transactions are excluded.
 */
export const arbitraryDateNotInMonth = (yearMonth: string): fc.Arbitrary<string> =>
  arbitraryDate().filter((d) => !d.startsWith(yearMonth));

// ─── TransactionInput Arbitraries ────────────────────────────────────────────

/** Generates a valid TransactionInput with arbitrary type. */
export const arbitraryTransactionInput = (): fc.Arbitrary<TransactionInput> =>
  fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
  });

/** Generates a valid INCOME TransactionInput. */
export const arbitraryIncomeInput = (): fc.Arbitrary<TransactionInput> =>
  arbitraryTransactionInput().map((t) => ({ ...t, type: 'INCOME' as TransactionType }));

/** Generates a valid EXPENSE TransactionInput. */
export const arbitraryExpenseInput = (): fc.Arbitrary<TransactionInput> =>
  arbitraryTransactionInput().map((t) => ({ ...t, type: 'EXPENSE' as TransactionType }));

// ─── Full Transaction Arbitraries ────────────────────────────────────────────

/**
 * Generates a persisted Transaction with all fields including id, createdAt, updatedAt.
 * Suitable for testing manager and store functions that operate on stored transactions.
 */
export const arbitraryTransaction = (): fc.Arbitrary<Transaction> =>
  fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    createdAt: fc.date().map((d) => d.toISOString()),
    updatedAt: fc.date().map((d) => d.toISOString()),
  });

/**
 * Generates a list of 0–20 transactions.
 * Covers the empty-list edge case and moderate list sizes.
 */
export const arbitraryTransactionList = (): fc.Arbitrary<Transaction[]> =>
  fc.array(arbitraryTransaction(), { minLength: 0, maxLength: 20 });

/**
 * Generates a non-empty list of 1–20 transactions.
 * Use when the test requires at least one transaction to operate on.
 */
export const arbitraryNonEmptyTransactionList = (): fc.Arbitrary<Transaction[]> =>
  fc.array(arbitraryTransaction(), { minLength: 1, maxLength: 20 });

// ─── Budget Arbitraries ───────────────────────────────────────────────────────

/**
 * Generates a valid budget amount (> 0, finite, ≤ 100,000).
 * Matches the Budget_Manager validation rule: finite number > 0.
 */
export const arbitraryBudget = (): fc.Arbitrary<number> =>
  fc.float({ min: 0.01, max: 100_000, noNaN: true, noDefaultInfinity: true });
