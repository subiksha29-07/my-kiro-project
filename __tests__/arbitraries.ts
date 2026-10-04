/**
 * Shared fast-check arbitraries for the Smart Expense Tracker test suite.
 * All property-based test files (*.pbt.ts) import from this module.
 *
 * Design notes for fast-check 4.x compatibility:
 *  - fc.float() bounds must be 32-bit floats (Math.fround) in fc 4.x.
 *  - fc.date() shrinks toward epoch which can produce Invalid Date; use
 *    fc.integer({ min, max }) over millisecond epoch bounds instead.
 *  - Amount generation uses integer cents (fc.integer) to guarantee exactly
 *    2 decimal places, avoiding IEEE 754 rounding issues in the validator.
 */
import * as fc from 'fast-check';
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from '@/lib/transactions/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

// ─── Internal date helpers ────────────────────────────────────────────────────

/** Millisecond timestamps for the safe date range 2020-01-01 – 2030-12-31 UTC. */
const DATE_MIN_MS = new Date('2020-01-01T00:00:00.000Z').getTime(); // 1577836800000
const DATE_MAX_MS = new Date('2030-12-31T23:59:59.999Z').getTime(); // 1924991999999

/**
 * Generates a safe Date object in the range 2020-01-01 – 2030-12-31 UTC.
 * Uses fc.integer over milliseconds to avoid fc.date() shrinking to out-of-range
 * values that throw RangeError in toISOString().
 */
const safeDateMs = (): fc.Arbitrary<number> =>
  fc.integer({ min: DATE_MIN_MS, max: DATE_MAX_MS });

// ─── Primitive Arbitraries ────────────────────────────────────────────────────

/** Generates a valid TransactionType ('INCOME' or 'EXPENSE'). */
export const arbitraryTransactionType = (): fc.Arbitrary<TransactionType> =>
  fc.constantFrom<TransactionType>('INCOME', 'EXPENSE');

/**
 * Generates a valid positive amount that satisfies the validator's 2-decimal-place
 * check: `Math.round(v * 100) === v * 100`.
 *
 * Strategy: generate integer cents, divide by 100, then verify the round-trip
 * holds exactly in IEEE 754. The filter discards values where floating-point
 * representation causes the equality to fail (e.g. 14/100 = 0.14000000000000001).
 * Range is capped at $99.99 (9999 cents) to maximise filter hit rate.
 */
export const arbitraryAmount = (): fc.Arbitrary<number> =>
  fc
    .integer({ min: 1, max: 9_999 })
    .map((cents) => cents / 100)
    .filter((v) => Math.round(v * 100) === v * 100);

/**
 * Generates an invalid amount (zero, negative, NaN, or Infinity).
 * Used to test that the validator correctly rejects bad amounts.
 */
export const arbitraryInvalidAmount = (): fc.Arbitrary<number> =>
  fc.oneof(
    fc.constant(0),
    fc.integer({ min: -99_999_999, max: -1 }).map((c) => c / 100),
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
 * Uses millisecond integer to avoid fc.date() shrinking issues in fast-check 4.x.
 */
export const arbitraryDate = (): fc.Arbitrary<string> =>
  safeDateMs().map((ms) => new Date(ms).toISOString().slice(0, 10));

/**
 * Generates a full ISO 8601 timestamp string (e.g. "2024-06-15T10:30:00.000Z").
 * Used for createdAt / updatedAt fields.
 */
const arbitraryTimestamp = (): fc.Arbitrary<string> =>
  safeDateMs().map((ms) => new Date(ms).toISOString());

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
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getTime();
  const lastDay = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).getTime();
  return fc
    .integer({ min: firstDay, max: lastDay })
    .map((ms) => new Date(ms).toISOString().slice(0, 10));
};

/**
 * Generates a date string guaranteed NOT to fall within the given yearMonth.
 * Used in budget property tests to verify out-of-scope transactions are excluded.
 */
export const arbitraryDateNotInMonth = (yearMonth: string): fc.Arbitrary<string> =>
  arbitraryDate().filter((d) => !d.startsWith(yearMonth));

// ─── TransactionInput Arbitraries ────────────────────────────────────────────

/**
 * Generates a valid TransactionInput with arbitrary type.
 * - title: non-empty, non-whitespace-only, max 100 chars
 * - amount: exactly 2dp via integer-cents generation
 * - category: from the predefined list
 * - date: valid YYYY-MM-DD in 2020–2030
 */
export const arbitraryTransactionInput = (): fc.Arbitrary<TransactionInput> =>
  fc.record({
    title: fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length > 0),
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
 *
 * createdAt/updatedAt use arbitraryTimestamp() (millisecond-based) to avoid
 * RangeError from fc.date() shrinking to out-of-range values.
 */
export const arbitraryTransaction = (): fc.Arbitrary<Transaction> =>
  fc.record({
    id: fc.uuid(),
    title: fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length > 0),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    createdAt: arbitraryTimestamp(),
    updatedAt: arbitraryTimestamp(),
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
 * Generates a valid budget amount (> 0, exactly 2dp, ≤ 100,000).
 * Uses integer cents for the same precision guarantee as arbitraryAmount.
 */
export const arbitraryBudget = (): fc.Arbitrary<number> =>
  // 1 cent to 10,000,000 cents (= $0.01 to $100,000.00)
  fc.integer({ min: 1, max: 10_000_000 }).map((cents) => cents / 100);
