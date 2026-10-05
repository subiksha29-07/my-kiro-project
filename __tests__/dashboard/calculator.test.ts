/**
 * Unit tests for calculateSummary and formatCurrency.
 */
import { describe, it, expect } from 'vitest';
import { calculateSummary } from '@/lib/dashboard/calculator';
import { formatCurrency } from '@/lib/utils/currency';
import type { Transaction } from '@/lib/transactions/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeTransaction(
  type: 'INCOME' | 'EXPENSE',
  amount: number,
  id = crypto.randomUUID(),
): Transaction {
  return {
    id,
    title: 'Test',
    amount,
    type,
    category: type === 'INCOME' ? 'Salary' : 'Food',
    date: '2024-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── calculateSummary tests ──────────────────────────────────────────────────

describe('calculateSummary', () => {
  it('returns all zeros for an empty list', () => {
    const result = calculateSummary([]);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpenses).toBe(0);
    expect(result.balance).toBe(0);
  });

  it('handles INCOME-only list: balance === totalIncome, totalExpenses === 0', () => {
    const transactions = [
      makeTransaction('INCOME', 100),
      makeTransaction('INCOME', 250.5),
    ];
    const result = calculateSummary(transactions);
    expect(result.totalExpenses).toBe(0);
    expect(result.totalIncome).toBeCloseTo(350.5, 9);
    expect(result.balance).toBeCloseTo(result.totalIncome, 9);
  });

  it('handles EXPENSE-only list: balance === -totalExpenses, totalIncome === 0', () => {
    const transactions = [
      makeTransaction('EXPENSE', 50),
      makeTransaction('EXPENSE', 75.25),
    ];
    const result = calculateSummary(transactions);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpenses).toBeCloseTo(125.25, 9);
    expect(result.balance).toBeCloseTo(-result.totalExpenses, 9);
  });

  it('handles mixed list: balance === totalIncome - totalExpenses', () => {
    const transactions = [
      makeTransaction('INCOME', 1000),
      makeTransaction('EXPENSE', 200),
      makeTransaction('INCOME', 500),
      makeTransaction('EXPENSE', 150),
    ];
    const result = calculateSummary(transactions);
    expect(result.totalIncome).toBeCloseTo(1500, 9);
    expect(result.totalExpenses).toBeCloseTo(350, 9);
    expect(result.balance).toBeCloseTo(1150, 9);
    expect(result.balance).toBeCloseTo(result.totalIncome - result.totalExpenses, 9);
  });

  it('handles floating-point amounts (10.1 + 20.2) within 1e-9 tolerance', () => {
    const transactions = [
      makeTransaction('INCOME', 10.1),
      makeTransaction('INCOME', 20.2),
    ];
    const result = calculateSummary(transactions);
    expect(Math.abs(result.totalIncome - 30.3)).toBeLessThan(1e-9);
  });
});

// ─── formatCurrency tests ────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a positive number as "$1,234.56"', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero as "$0.00"', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a negative number starting with Unicode minus (U+2212)', () => {
    const result = formatCurrency(-123.45);
    // First character must be Unicode minus U+2212
    expect(result.charCodeAt(0)).toBe(0x2212);
    expect(result).toBe('\u2212$123.45');
  });

  it('formats a large number with thousands separator', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain(',');
    expect(result).toBe('$1,000,000.00');
  });
});
