# Shared Test Arbitraries Reference

This document describes the shared fast-check arbitraries to be created at `__tests__/arbitraries.ts` in the project. All property-based test files (`*.pbt.ts`) import from this file.

## File: `__tests__/arbitraries.ts`

```typescript
import * as fc from 'fast-check';
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from '@/lib/transactions/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

// ─── Primitive Arbitraries ────────────────────────────────────────────────────

/** Generates a valid TransactionType */
export const arbitraryTransactionType = (): fc.Arbitrary<TransactionType> =>
  fc.constantFrom<TransactionType>('INCOME', 'EXPENSE');

/** Generates a valid positive amount (> 0, finite, max 1,000,000) */
export const arbitraryAmount = (): fc.Arbitrary<number> =>
  fc.float({ min: 0.01, max: 1_000_000, noNaN: true, noDefaultInfinity: true });

/** Generates an invalid amount (zero, negative, or non-finite) */
export const arbitraryInvalidAmount = (): fc.Arbitrary<number> =>
  fc.oneof(
    fc.constant(0),
    fc.float({ max: -0.01 }),
    fc.constant(NaN),
    fc.constant(Infinity),
    fc.constant(-Infinity)
  );

/** Generates a valid category name */
export const arbitraryCategory = (): fc.Arbitrary<string> =>
  fc.constantFrom(...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES);

/** Generates a valid ISO date string YYYY-MM-DD */
export const arbitraryDate = (): fc.Arbitrary<string> =>
  fc.date({
    min: new Date('2020-01-01'),
    max: new Date('2030-12-31'),
  }).map(d => d.toISOString().slice(0, 10));

/** Generates a YYYY-MM string for the year-month parameter */
export const arbitraryYearMonth = (): fc.Arbitrary<string> =>
  arbitraryDate().map(d => d.slice(0, 7));

/** Generates a date string guaranteed to fall within the given yearMonth */
export const arbitraryDateInMonth = (yearMonth: string): fc.Arbitrary<string> => {
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0); // last day of month
  return fc.date({ min: firstDay, max: lastDay }).map(d => d.toISOString().slice(0, 10));
};

/** Generates a date string guaranteed to NOT fall within the given yearMonth */
export const arbitraryDateNotInMonth = (yearMonth: string): fc.Arbitrary<string> =>
  arbitraryDate().filter(d => !d.startsWith(yearMonth));

// ─── TransactionInput Arbitrary ──────────────────────────────────────────────

/** Generates a valid TransactionInput */
export const arbitraryTransactionInput = (): fc.Arbitrary<TransactionInput> =>
  fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
  });

/** Generates a valid INCOME TransactionInput */
export const arbitraryIncomeInput = (): fc.Arbitrary<TransactionInput> =>
  arbitraryTransactionInput().map(t => ({ ...t, type: 'INCOME' as TransactionType }));

/** Generates a valid EXPENSE TransactionInput */
export const arbitraryExpenseInput = (): fc.Arbitrary<TransactionInput> =>
  arbitraryTransactionInput().map(t => ({ ...t, type: 'EXPENSE' as TransactionType }));

// ─── Full Transaction Arbitrary ──────────────────────────────────────────────

/** Generates a persisted Transaction (with id, createdAt, updatedAt) */
export const arbitraryTransaction = (): fc.Arbitrary<Transaction> =>
  fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    createdAt: fc.date().map(d => d.toISOString()),
    updatedAt: fc.date().map(d => d.toISOString()),
  });

/** Generates a list of 0–20 transactions */
export const arbitraryTransactionList = (): fc.Arbitrary<Transaction[]> =>
  fc.array(arbitraryTransaction(), { minLength: 0, maxLength: 20 });

/** Generates a non-empty list of transactions */
export const arbitraryNonEmptyTransactionList = (): fc.Arbitrary<Transaction[]> =>
  fc.array(arbitraryTransaction(), { minLength: 1, maxLength: 20 });

// ─── Budget Arbitrary ─────────────────────────────────────────────────────────

/** Generates a valid budget amount */
export const arbitraryBudget = (): fc.Arbitrary<number> =>
  fc.float({ min: 0.01, max: 100_000, noNaN: true, noDefaultInfinity: true });
```

## Usage Example

```typescript
// __tests__/transactions/manager.pbt.ts
import * as fc from 'fast-check';
import { describe, it } from 'vitest';
import { calculateSummary } from '@/lib/dashboard/calculator';
import { arbitraryTransactionList } from '../arbitraries';

describe('Balance Calculator - Property-Based Tests', () => {
  it('balance always equals totalIncome minus totalExpenses', () => {
    fc.assert(
      fc.property(arbitraryTransactionList(), (transactions) => {
        const { totalIncome, totalExpenses, balance } = calculateSummary(transactions);
        return Math.abs(balance - (totalIncome - totalExpenses)) < 1e-9;
      }),
      { numRuns: 100 }
    );
  });
});
```
