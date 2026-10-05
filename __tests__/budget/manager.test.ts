/**
 * Unit tests for lib/budget/manager.ts
 */
import { describe, it, expect } from 'vitest';
import { computeMonthlyExpenses, evaluateBudget } from '@/lib/budget/manager';
import type { Transaction } from '@/lib/transactions/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeExpense(amount: number, date: string): Transaction {
  return {
    id: 'test-id',
    title: 'Test Expense',
    amount,
    type: 'EXPENSE',
    category: 'Food',
    date,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

function makeIncome(amount: number, date: string): Transaction {
  return {
    id: 'test-id',
    title: 'Test Income',
    amount,
    type: 'INCOME',
    category: 'Salary',
    date,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

// ─── computeMonthlyExpenses ───────────────────────────────────────────────────

describe('computeMonthlyExpenses', () => {
  it('returns 0 for an empty transaction list', () => {
    expect(computeMonthlyExpenses([], '2026-10')).toBe(0);
  });

  it("returns the expense amount for one EXPENSE in '2026-10'", () => {
    const transactions = [makeExpense(50, '2026-10-05')];
    expect(computeMonthlyExpenses(transactions, '2026-10')).toBe(50);
  });

  it("returns the sum for two EXPENSEs in '2026-10'", () => {
    const transactions = [makeExpense(30, '2026-10-01'), makeExpense(20, '2026-10-15')];
    expect(computeMonthlyExpenses(transactions, '2026-10')).toBe(50);
  });

  it("returns 0 for an EXPENSE in '2026-09' when yearMonth is '2026-10'", () => {
    const transactions = [makeExpense(100, '2026-09-30')];
    expect(computeMonthlyExpenses(transactions, '2026-10')).toBe(0);
  });

  it("returns 0 for an INCOME in '2026-10' (type excluded)", () => {
    const transactions = [makeIncome(200, '2026-10-10')];
    expect(computeMonthlyExpenses(transactions, '2026-10')).toBe(0);
  });

  it('excludes transactions with date=undefined without throwing', () => {
    const t = { ...makeExpense(100, '2026-10-01'), date: undefined as unknown as string };
    expect(() => computeMonthlyExpenses([t], '2026-10')).not.toThrow();
    expect(computeMonthlyExpenses([t], '2026-10')).toBe(0);
  });

  it("excludes transactions with date='' without throwing", () => {
    const t = { ...makeExpense(100, '2026-10-01'), date: '' };
    expect(() => computeMonthlyExpenses([t], '2026-10')).not.toThrow();
    expect(computeMonthlyExpenses([t], '2026-10')).toBe(0);
  });
});

// ─── evaluateBudget ───────────────────────────────────────────────────────────

describe('evaluateBudget', () => {
  it('returns NO_BUDGET status when budget is null', () => {
    const result = evaluateBudget([], null, '2026-10');
    expect(result.status).toBe('NO_BUDGET');
    expect(result.remaining).toBeNull();
    expect(result.overspend).toBeNull();
    expect(result.percentage).toBe(0);
    expect(result.budget).toBeNull();
  });

  it('returns WITHIN_BUDGET when monthlyExpenses < budget', () => {
    const transactions = [makeExpense(50, '2026-10-01')];
    const result = evaluateBudget(transactions, 200, '2026-10');
    expect(result.status).toBe('WITHIN_BUDGET');
    expect(result.remaining).toBe(150);
    expect(result.overspend).toBeNull();
    expect(result.monthlyExpenses).toBe(50);
  });

  it('returns WITHIN_BUDGET with remaining=0 when monthlyExpenses === budget', () => {
    const transactions = [makeExpense(100, '2026-10-01')];
    const result = evaluateBudget(transactions, 100, '2026-10');
    expect(result.status).toBe('WITHIN_BUDGET');
    expect(result.remaining).toBe(0);
    expect(result.overspend).toBeNull();
  });

  it('returns OVER_BUDGET when monthlyExpenses > budget', () => {
    const transactions = [makeExpense(150, '2026-10-01')];
    const result = evaluateBudget(transactions, 100, '2026-10');
    expect(result.status).toBe('OVER_BUDGET');
    expect(result.remaining).toBeNull();
    expect(result.overspend).toBe(50);
    expect(result.monthlyExpenses).toBe(150);
  });

  it('computes percentage=75 when monthlyExpenses=75 and budget=100', () => {
    const transactions = [makeExpense(75, '2026-10-01')];
    const result = evaluateBudget(transactions, 100, '2026-10');
    expect(result.percentage).toBe(75);
  });

  it('computes percentage=150 when monthlyExpenses=150 and budget=100', () => {
    const transactions = [makeExpense(150, '2026-10-01')];
    const result = evaluateBudget(transactions, 100, '2026-10');
    expect(result.percentage).toBe(150);
  });
});
