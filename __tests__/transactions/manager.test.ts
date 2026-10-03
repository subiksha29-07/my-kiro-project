/**
 * Unit tests for lib/transactions/manager.ts
 * Covers: addTransaction, getTransactions, updateTransaction, deleteTransaction.
 * Requirements: 1.1, 1.9, 2.1, 3.2, 3.4, 3.6, 4.1, 4.2, 5.1–5.6
 */

import { describe, it, expect } from 'vitest';
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '@/lib/transactions/manager';
import type { Transaction, TransactionInput } from '@/lib/transactions/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

/** A minimal valid TransactionInput for convenience. */
const INCOME_INPUT: TransactionInput = {
  title: 'Salary',
  amount: 3000,
  type: 'INCOME',
  category: 'Salary',
  date: '2024-07-01',
};

const EXPENSE_INPUT: TransactionInput = {
  title: 'Groceries',
  amount: 80.50,
  type: 'EXPENSE',
  category: 'Food',
  date: '2024-07-02',
};

/** Builds a Transaction fixture with predictable fields for sorting/filtering tests. */
function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: crypto.randomUUID(),
    title: 'Test',
    amount: 10,
    type: 'EXPENSE',
    category: 'Food',
    date: '2024-01-01',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
    ...overrides,
  };
}

// ─── addTransaction ───────────────────────────────────────────────────────────

describe('addTransaction', () => {
  it('returns a new store with the transaction appended', () => {
    const result = addTransaction([], INCOME_INPUT);
    expect(result.store).toHaveLength(1);
    expect(result.store[0].title).toBe('Salary');
  });

  it('does not mutate the input store array', () => {
    const original: Transaction[] = [];
    addTransaction(original, INCOME_INPUT);
    expect(original).toHaveLength(0);
  });

  it('assigns a non-empty UUID v4 id to the new transaction', () => {
    const { transaction } = addTransaction([], INCOME_INPUT);
    // UUID v4 pattern
    expect(transaction.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('sets createdAt and updatedAt to the same ISO timestamp', () => {
    const { transaction } = addTransaction([], INCOME_INPUT);
    expect(transaction.createdAt).toBe(transaction.updatedAt);
    expect(() => new Date(transaction.createdAt)).not.toThrow();
  });

  it('preserves all input fields on the returned transaction', () => {
    const input: TransactionInput = {
      ...EXPENSE_INPUT,
      description: 'Weekly shop',
    };
    const { transaction } = addTransaction([], input);
    expect(transaction.title).toBe(input.title);
    expect(transaction.amount).toBe(input.amount);
    expect(transaction.type).toBe(input.type);
    expect(transaction.category).toBe(input.category);
    expect(transaction.date).toBe(input.date);
    expect(transaction.description).toBe('Weekly shop');
  });

  it('omits description when not provided', () => {
    const { transaction } = addTransaction([], INCOME_INPUT);
    expect(transaction.description).toBeUndefined();
  });

  it('appends to a non-empty store without affecting existing items', () => {
    const tx1 = makeTx({ id: 'id-1' });
    const result = addTransaction([tx1], EXPENSE_INPUT);
    expect(result.store).toHaveLength(2);
    expect(result.store[0].id).toBe('id-1');
    expect(result.store[1].title).toBe('Groceries');
  });

  it('throws when given an invalid input (caller bug guard)', () => {
    const bad: TransactionInput = { ...INCOME_INPUT, title: '' };
    expect(() => addTransaction([], bad)).toThrow();
  });

  it('store reference and transaction reference are consistent', () => {
    const { store, transaction } = addTransaction([], INCOME_INPUT);
    expect(store[store.length - 1]).toBe(transaction);
  });
});

// ─── getTransactions ──────────────────────────────────────────────────────────

describe('getTransactions', () => {
  it('returns [] for an empty store', () => {
    expect(getTransactions([])).toEqual([]);
  });

  it('returns all transactions when no filters are provided', () => {
    const store = [makeTx(), makeTx()];
    expect(getTransactions(store)).toHaveLength(2);
  });

  it('does not mutate the input store array', () => {
    const store = [
      makeTx({ date: '2024-01-01' }),
      makeTx({ date: '2024-03-01' }),
    ];
    const originalIds = store.map((t) => t.id);
    getTransactions(store);
    expect(store.map((t) => t.id)).toEqual(originalIds);
  });

  // ── Sorting ────────────────────────────────────────────────────────────────

  it('sorts by date descending (most recent first)', () => {
    const older = makeTx({ date: '2024-01-01', createdAt: '2024-01-01T08:00:00.000Z' });
    const newer = makeTx({ date: '2024-06-15', createdAt: '2024-06-15T08:00:00.000Z' });
    const result = getTransactions([older, newer]);
    expect(result[0].date).toBe('2024-06-15');
    expect(result[1].date).toBe('2024-01-01');
  });

  it('tie-breaks by createdAt descending when dates are equal', () => {
    const first = makeTx({
      id: 'first',
      date: '2024-05-01',
      createdAt: '2024-05-01T08:00:00.000Z',
    });
    const second = makeTx({
      id: 'second',
      date: '2024-05-01',
      createdAt: '2024-05-01T12:00:00.000Z', // recorded later
    });
    const result = getTransactions([first, second]);
    // second was recorded later → comes first
    expect(result[0].id).toBe('second');
    expect(result[1].id).toBe('first');
  });

  it('is stable for a single-item store', () => {
    const tx = makeTx();
    expect(getTransactions([tx])).toEqual([tx]);
  });

  // ── Filter by type ─────────────────────────────────────────────────────────

  it('filters by type INCOME', () => {
    const income = makeTx({ type: 'INCOME' });
    const expense = makeTx({ type: 'EXPENSE' });
    const result = getTransactions([income, expense], { type: 'INCOME' });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('INCOME');
  });

  it('filters by type EXPENSE', () => {
    const income = makeTx({ type: 'INCOME' });
    const expense = makeTx({ type: 'EXPENSE' });
    const result = getTransactions([income, expense], { type: 'EXPENSE' });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('EXPENSE');
  });

  it('returns [] when type filter matches nothing', () => {
    const income = makeTx({ type: 'INCOME' });
    expect(getTransactions([income], { type: 'EXPENSE' })).toEqual([]);
  });

  // ── Filter by category ─────────────────────────────────────────────────────

  it('filters by category', () => {
    const food = makeTx({ category: 'Food' });
    const rent = makeTx({ category: 'Housing' });
    const result = getTransactions([food, rent], { category: 'Food' });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('Food');
  });

  it('returns [] when category filter matches nothing', () => {
    const tx = makeTx({ category: 'Food' });
    expect(getTransactions([tx], { category: 'Salary' })).toEqual([]);
  });

  // ── Filter by both type AND category ──────────────────────────────────────

  it('applies both type and category filters (AND logic)', () => {
    const match = makeTx({ type: 'EXPENSE', category: 'Food' });
    const wrongType = makeTx({ type: 'INCOME', category: 'Food' });
    const wrongCat = makeTx({ type: 'EXPENSE', category: 'Housing' });
    const result = getTransactions([match, wrongType, wrongCat], {
      type: 'EXPENSE',
      category: 'Food',
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(match);
  });

  it('returns [] when both filters match nothing together', () => {
    const tx = makeTx({ type: 'INCOME', category: 'Salary' });
    expect(
      getTransactions([tx], { type: 'EXPENSE', category: 'Salary' }),
    ).toEqual([]);
  });

  // ── Clear filters ──────────────────────────────────────────────────────────

  it('returns all transactions when empty FilterOptions object is passed', () => {
    const store = [makeTx(), makeTx(), makeTx()];
    expect(getTransactions(store, {})).toHaveLength(3);
  });

  it('returns all transactions when filters is undefined', () => {
    const store = [makeTx(), makeTx()];
    expect(getTransactions(store, undefined)).toHaveLength(2);
  });

  // ── Filtered results are still sorted ─────────────────────────────────────

  it('applies sorting to filtered results', () => {
    const old = makeTx({ type: 'EXPENSE', date: '2024-01-01' });
    const recent = makeTx({ type: 'EXPENSE', date: '2024-09-01' });
    const result = getTransactions([old, recent], { type: 'EXPENSE' });
    expect(result[0].date).toBe('2024-09-01');
    expect(result[1].date).toBe('2024-01-01');
  });
});

// ─── updateTransaction ────────────────────────────────────────────────────────

describe('updateTransaction', () => {
  const BASE = makeTx({
    id: 'target-id',
    title: 'Original',
    amount: 100,
    type: 'EXPENSE',
    category: 'Food',
    date: '2024-03-01',
    createdAt: '2024-03-01T09:00:00.000Z',
    updatedAt: '2024-03-01T09:00:00.000Z',
  });

  const NEW_INPUT: TransactionInput = {
    title: 'Updated',
    amount: 200,
    type: 'INCOME',
    category: 'Salary',
    date: '2024-04-01',
  };

  it('returns NOT_FOUND when id does not exist in store', () => {
    const result = updateTransaction([], 'nonexistent', NEW_INPUT, '2024-03-01T09:00:00.000Z');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('NOT_FOUND');
  });

  it('returns NOT_FOUND for a different id in a non-empty store', () => {
    const result = updateTransaction([BASE], 'wrong-id', NEW_INPUT, BASE.updatedAt);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('NOT_FOUND');
  });

  it('returns STALE_UPDATE when expectedUpdatedAt does not match stored updatedAt', () => {
    const result = updateTransaction([BASE], BASE.id, NEW_INPUT, '2000-01-01T00:00:00.000Z');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('STALE_UPDATE');
  });

  it('returns ok:true with updated transaction on success', () => {
    const result = updateTransaction([BASE], BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.transaction.title).toBe('Updated');
      expect(result.data.transaction.amount).toBe(200);
      expect(result.data.transaction.type).toBe('INCOME');
      expect(result.data.transaction.category).toBe('Salary');
      expect(result.data.transaction.date).toBe('2024-04-01');
    }
  });

  it('preserves the original id on the updated transaction', () => {
    const result = updateTransaction([BASE], BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.transaction.id).toBe('target-id');
  });

  it('preserves createdAt on the updated transaction', () => {
    const result = updateTransaction([BASE], BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.transaction.createdAt).toBe('2024-03-01T09:00:00.000Z');
    }
  });

  it('sets updatedAt to a new timestamp after successful update', () => {
    const before = new Date().toISOString();
    const result = updateTransaction([BASE], BASE.id, NEW_INPUT, BASE.updatedAt);
    const after = new Date().toISOString();
    expect(result.ok).toBe(true);
    if (result.ok) {
      const newUpdatedAt = result.data.transaction.updatedAt;
      expect(newUpdatedAt).not.toBe(BASE.updatedAt);
      expect(newUpdatedAt >= before).toBe(true);
      expect(newUpdatedAt <= after).toBe(true);
    }
  });

  it('returns a new store array with the updated transaction in place', () => {
    const other = makeTx({ id: 'other-id' });
    const result = updateTransaction([BASE, other], BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.store).toHaveLength(2);
      const updated = result.data.store.find((t) => t.id === 'target-id');
      expect(updated?.title).toBe('Updated');
      // other transaction unchanged
      expect(result.data.store.find((t) => t.id === 'other-id')).toBeDefined();
    }
  });

  it('does not mutate the original store array', () => {
    const store = [BASE];
    updateTransaction(store, BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(store[0].title).toBe('Original');
    expect(store[0].updatedAt).toBe(BASE.updatedAt);
  });

  it('does not mutate the original transaction object', () => {
    const originalUpdatedAt = BASE.updatedAt;
    updateTransaction([BASE], BASE.id, NEW_INPUT, BASE.updatedAt);
    expect(BASE.updatedAt).toBe(originalUpdatedAt);
    expect(BASE.title).toBe('Original');
  });

  it('stores the stale original transaction unchanged on STALE_UPDATE', () => {
    const store = [BASE];
    updateTransaction(store, BASE.id, NEW_INPUT, 'stale-timestamp');
    // Original store item is untouched
    expect(store[0].title).toBe('Original');
    expect(store[0].updatedAt).toBe(BASE.updatedAt);
  });
});

// ─── deleteTransaction ────────────────────────────────────────────────────────

describe('deleteTransaction', () => {
  it('returns NOT_FOUND when id does not exist in an empty store', () => {
    const result = deleteTransaction([], 'nonexistent');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('NOT_FOUND');
  });

  it('returns NOT_FOUND when id does not exist in a non-empty store', () => {
    const tx = makeTx({ id: 'exists' });
    const result = deleteTransaction([tx], 'does-not-exist');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('NOT_FOUND');
  });

  it('returns ok:true with the transaction removed on success', () => {
    const tx = makeTx({ id: 'to-delete' });
    const result = deleteTransaction([tx], 'to-delete');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.store).toHaveLength(0);
    }
  });

  it('removes only the requested transaction and leaves others untouched', () => {
    const keep1 = makeTx({ id: 'keep-1' });
    const remove = makeTx({ id: 'remove-me' });
    const keep2 = makeTx({ id: 'keep-2' });
    const result = deleteTransaction([keep1, remove, keep2], 'remove-me');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.store).toHaveLength(2);
      expect(result.data.store.find((t) => t.id === 'remove-me')).toBeUndefined();
      expect(result.data.store.find((t) => t.id === 'keep-1')).toBeDefined();
      expect(result.data.store.find((t) => t.id === 'keep-2')).toBeDefined();
    }
  });

  it('does not mutate the original store array', () => {
    const tx = makeTx({ id: 'del-test' });
    const store = [tx];
    deleteTransaction(store, 'del-test');
    expect(store).toHaveLength(1);
    expect(store[0].id).toBe('del-test');
  });

  it('reduces store length by exactly 1 on success', () => {
    const store = [makeTx(), makeTx({ id: 'target' }), makeTx()];
    const result = deleteTransaction(store, 'target');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.store).toHaveLength(2);
  });
});
