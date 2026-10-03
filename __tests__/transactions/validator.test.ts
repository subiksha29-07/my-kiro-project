/**
 * Unit tests for lib/transactions/validator.ts — validateTransaction()
 * One describe block per field, plus a multi-field failure test.
 * Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.3
 */

import { describe, it, expect } from 'vitest';
import { validateTransaction } from '@/lib/transactions/validator';
import type { TransactionInput } from '@/lib/transactions/types';

// A valid baseline input — all tests start from this and override one field at a time.
const VALID: TransactionInput = {
  title: 'Grocery run',
  amount: 42.50,
  type: 'EXPENSE',
  category: 'Food',
  date: '2024-06-15',
  description: undefined,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Build an input by merging overrides on top of VALID. */
function make(overrides: Partial<TransactionInput>): TransactionInput {
  return { ...VALID, ...overrides } as TransactionInput;
}

/** Returns the error messages for a given field from the result. */
function errorsFor(input: TransactionInput, field: string): string[] {
  const result = validateTransaction(input);
  return result.errors.filter((e) => e.field === field).map((e) => e.message);
}

// ─── Happy path ───────────────────────────────────────────────────────────────

describe('validateTransaction — valid input', () => {
  it('returns valid: true and empty errors for a fully valid EXPENSE input', () => {
    const result = validateTransaction(VALID);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns valid: true for a fully valid INCOME input with description', () => {
    const result = validateTransaction(
      make({ type: 'INCOME', category: 'Salary', description: 'Monthly pay' }),
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns valid: true when description is omitted entirely', () => {
    const { description: _omit, ...rest } = VALID;
    const result = validateTransaction(rest as TransactionInput);
    expect(result.valid).toBe(true);
  });
});

// ─── title ────────────────────────────────────────────────────────────────────

describe('validateTransaction — title', () => {
  it('rejects an empty string', () => {
    const result = validateTransaction(make({ title: '' }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ title: '' }), 'title').length).toBeGreaterThan(0);
  });

  it('rejects a whitespace-only string', () => {
    const result = validateTransaction(make({ title: '   ' }));
    expect(result.valid).toBe(false);
  });

  it('accepts a title of exactly 100 characters', () => {
    const title = 'a'.repeat(100);
    const result = validateTransaction(make({ title }));
    expect(result.valid).toBe(true);
  });

  it('rejects a title of 101 characters', () => {
    const title = 'a'.repeat(101);
    const result = validateTransaction(make({ title }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ title }), 'title').length).toBeGreaterThan(0);
  });
});

// ─── amount ───────────────────────────────────────────────────────────────────

describe('validateTransaction — amount', () => {
  it('rejects amount = 0', () => {
    const result = validateTransaction(make({ amount: 0 }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ amount: 0 }), 'amount').length).toBeGreaterThan(0);
  });

  it('rejects a negative amount', () => {
    const result = validateTransaction(make({ amount: -1 }));
    expect(result.valid).toBe(false);
  });

  it('accepts amount = 0.01 (minimum positive with 2 dp)', () => {
    const result = validateTransaction(make({ amount: 0.01 }));
    expect(result.valid).toBe(true);
  });

  it('rejects amount = 0.001 (more than 2 decimal places)', () => {
    const result = validateTransaction(make({ amount: 0.001 }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ amount: 0.001 }), 'amount').length).toBeGreaterThan(0);
  });

  it('accepts amount = 999999999.99 (maximum valid)', () => {
    const result = validateTransaction(make({ amount: 999_999_999.99 }));
    expect(result.valid).toBe(true);
  });

  it('rejects amount = 1000000000 (exceeds maximum)', () => {
    const result = validateTransaction(make({ amount: 1_000_000_000 }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ amount: 1_000_000_000 }), 'amount').length).toBeGreaterThan(0);
  });

  it('rejects NaN', () => {
    const result = validateTransaction(make({ amount: NaN }));
    expect(result.valid).toBe(false);
  });

  it('rejects Infinity', () => {
    const result = validateTransaction(make({ amount: Infinity }));
    expect(result.valid).toBe(false);
  });

  it('rejects -Infinity', () => {
    const result = validateTransaction(make({ amount: -Infinity }));
    expect(result.valid).toBe(false);
  });

  it('accepts a valid whole-number amount', () => {
    const result = validateTransaction(make({ amount: 100 }));
    expect(result.valid).toBe(true);
  });

  it('accepts amount with exactly 1 decimal place', () => {
    const result = validateTransaction(make({ amount: 9.5 }));
    expect(result.valid).toBe(true);
  });
});

// ─── type ─────────────────────────────────────────────────────────────────────

describe('validateTransaction — type', () => {
  it('accepts INCOME', () => {
    const result = validateTransaction(make({ type: 'INCOME' }));
    expect(result.valid).toBe(true);
  });

  it('accepts EXPENSE', () => {
    const result = validateTransaction(make({ type: 'EXPENSE' }));
    expect(result.valid).toBe(true);
  });

  it('rejects an arbitrary string', () => {
    // Cast to bypass TypeScript — we are testing the runtime guard.
    const result = validateTransaction(make({ type: 'DEBIT' as 'INCOME' }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ type: 'DEBIT' as 'INCOME' }), 'type').length).toBeGreaterThan(0);
  });

  it('rejects lowercase income', () => {
    const result = validateTransaction(make({ type: 'income' as 'INCOME' }));
    expect(result.valid).toBe(false);
  });

  it('rejects an empty string type', () => {
    const result = validateTransaction(make({ type: '' as 'INCOME' }));
    expect(result.valid).toBe(false);
  });
});

// ─── category ─────────────────────────────────────────────────────────────────

describe('validateTransaction — category', () => {
  it('rejects an empty category', () => {
    const result = validateTransaction(make({ category: '' }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ category: '' }), 'category').length).toBeGreaterThan(0);
  });

  it('rejects a whitespace-only category', () => {
    const result = validateTransaction(make({ category: '   ' }));
    expect(result.valid).toBe(false);
  });

  it('accepts a category of exactly 100 characters', () => {
    const category = 'x'.repeat(100);
    const result = validateTransaction(make({ category }));
    expect(result.valid).toBe(true);
  });

  it('rejects a category of 101 characters', () => {
    const category = 'x'.repeat(101);
    const result = validateTransaction(make({ category }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ category }), 'category').length).toBeGreaterThan(0);
  });
});

// ─── date ─────────────────────────────────────────────────────────────────────

describe('validateTransaction — date', () => {
  it('accepts a valid date 2024-01-15', () => {
    const result = validateTransaction(make({ date: '2024-01-15' }));
    expect(result.valid).toBe(true);
  });

  it('accepts the earliest valid date 1900-01-01', () => {
    const result = validateTransaction(make({ date: '1900-01-01' }));
    expect(result.valid).toBe(true);
  });

  it('accepts the latest valid date 2100-12-31', () => {
    const result = validateTransaction(make({ date: '2100-12-31' }));
    expect(result.valid).toBe(true);
  });

  it('rejects a date before the minimum: 1899-12-31', () => {
    const result = validateTransaction(make({ date: '1899-12-31' }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ date: '1899-12-31' }), 'date').length).toBeGreaterThan(0);
  });

  it('rejects a date after the maximum: 2101-01-01', () => {
    const result = validateTransaction(make({ date: '2101-01-01' }));
    expect(result.valid).toBe(false);
  });

  it('rejects an impossible calendar date: 2023-02-30', () => {
    const result = validateTransaction(make({ date: '2023-02-30' }));
    expect(result.valid).toBe(false);
  });

  it('rejects month 13: 2024-13-01', () => {
    const result = validateTransaction(make({ date: '2024-13-01' }));
    expect(result.valid).toBe(false);
  });

  it('rejects wrong format: 2024/06/15', () => {
    const result = validateTransaction(make({ date: '2024/06/15' }));
    expect(result.valid).toBe(false);
  });

  it('rejects wrong format: 15-06-2024 (DD-MM-YYYY)', () => {
    const result = validateTransaction(make({ date: '15-06-2024' }));
    expect(result.valid).toBe(false);
  });

  it('rejects an empty date string', () => {
    const result = validateTransaction(make({ date: '' }));
    expect(result.valid).toBe(false);
  });

  it('accepts leap day 2024-02-29 (2024 is a leap year)', () => {
    const result = validateTransaction(make({ date: '2024-02-29' }));
    expect(result.valid).toBe(true);
  });

  it('rejects leap day 2023-02-29 (2023 is not a leap year)', () => {
    const result = validateTransaction(make({ date: '2023-02-29' }));
    expect(result.valid).toBe(false);
  });
});

// ─── description (optional) ───────────────────────────────────────────────────

describe('validateTransaction — description', () => {
  it('accepts undefined description (field omitted)', () => {
    const result = validateTransaction(make({ description: undefined }));
    expect(result.valid).toBe(true);
  });

  it('accepts an empty string description', () => {
    const result = validateTransaction(make({ description: '' }));
    expect(result.valid).toBe(true);
  });

  it('accepts a description of exactly 500 characters', () => {
    const result = validateTransaction(make({ description: 'd'.repeat(500) }));
    expect(result.valid).toBe(true);
  });

  it('rejects a description of 501 characters', () => {
    const result = validateTransaction(make({ description: 'd'.repeat(501) }));
    expect(result.valid).toBe(false);
    expect(errorsFor(make({ description: 'd'.repeat(501) }), 'description').length).toBeGreaterThan(0);
  });
});

// ─── Multi-field failures ──────────────────────────────────────────────────────

describe('validateTransaction — multiple failures returned simultaneously', () => {
  it('returns errors for all invalid fields at once, not just the first', () => {
    const badInput = make({
      title: '',          // invalid
      amount: 0,          // invalid
      type: 'DEBIT' as 'INCOME', // invalid
      category: '',       // invalid
      date: 'not-a-date', // invalid
    });
    const result = validateTransaction(badInput);
    expect(result.valid).toBe(false);
    const fields = result.errors.map((e) => e.field);
    expect(fields).toContain('title');
    expect(fields).toContain('amount');
    expect(fields).toContain('type');
    expect(fields).toContain('category');
    expect(fields).toContain('date');
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
  });

  it('returns exactly one error per invalid field', () => {
    const badInput = make({ title: '', amount: -1 });
    const result = validateTransaction(badInput);
    const titleErrors = result.errors.filter((e) => e.field === 'title');
    const amountErrors = result.errors.filter((e) => e.field === 'amount');
    expect(titleErrors).toHaveLength(1);
    expect(amountErrors).toHaveLength(1);
  });
});
