/**
 * Transaction business logic layer for the Smart Expense Tracker.
 * All functions are pure — they receive the current store array as a parameter
 * and return a new array. No mutation of inputs. No I/O. No React.
 */

import type {
  Transaction,
  TransactionInput,
  FilterOptions,
  ManagerResult,
} from './types';
import { validateTransaction } from './validator';

// ─── addTransaction ───────────────────────────────────────────────────────────

/**
 * Creates a new transaction from the given input and appends it to the store.
 *
 * Pre-condition: the caller (form / page) is responsible for running
 * validateTransaction before calling addTransaction. If an invalid input is
 * passed, this function throws — it is a programming error, not a user error.
 *
 * @param store - The current immutable transaction list.
 * @param input - The validated form data for the new transaction.
 * @returns An object containing:
 *   - `store`: a new array with the new transaction appended (input not mutated).
 *   - `transaction`: the newly created Transaction with id, createdAt, updatedAt.
 * @throws Error if the input fails validation (indicates a caller bug).
 *
 * Requirements: 1.1, 1.9
 */
export function addTransaction(
  store: readonly Transaction[],
  input: TransactionInput,
): { store: Transaction[]; transaction: Transaction } {
  const validation = validateTransaction(input);
  if (!validation.valid) {
    throw new Error(
      `addTransaction called with invalid input: ${validation.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('; ')}`,
    );
  }

  const now = new Date().toISOString();
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    title: input.title,
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date,
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    createdAt: now,
    updatedAt: now,
  };

  return {
    store: [...store, transaction],
    transaction,
  };
}

// ─── getTransactions ──────────────────────────────────────────────────────────

/**
 * Returns a filtered and sorted copy of the transaction store.
 *
 * Sorting (applied after filtering):
 *   Primary key:   `date` descending (most recent date first).
 *   Tie-breaker:   `createdAt` descending (most recently recorded first).
 *
 * Filtering:
 *   - `filters.type`     — exact match on `transaction.type`
 *   - `filters.category` — exact match on `transaction.category`
 *   - When both are set, both must match (AND logic).
 *   - When no filter matches, returns [].
 *
 * The input `store` array is never mutated.
 *
 * Requirements: 2.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */
export function getTransactions(
  store: readonly Transaction[],
  filters?: FilterOptions,
): Transaction[] {
  let result: Transaction[] = [...store];

  // Apply filters (AND logic — all supplied filters must match).
  if (filters?.type !== undefined) {
    result = result.filter((t) => t.type === filters.type);
  }
  if (filters?.category !== undefined) {
    result = result.filter((t) => t.category === filters.category);
  }

  // Sort: date desc (primary), createdAt desc (tie-breaker).
  result.sort((a, b) => {
    if (a.date !== b.date) {
      // Lexicographic comparison works correctly for ISO YYYY-MM-DD strings.
      return a.date > b.date ? -1 : 1;
    }
    // Same date — fall back to createdAt for deterministic ordering.
    return a.createdAt > b.createdAt ? -1 : 1;
  });

  return result;
}

// ─── updateTransaction ────────────────────────────────────────────────────────

/**
 * Updates the fields of an existing transaction, preserving its `id` and `createdAt`.
 *
 * Stale-update protection: `expectedUpdatedAt` is the `updatedAt` value the
 * caller last observed. If the stored transaction's `updatedAt` differs,
 * the store has been modified since the caller loaded it, and this function
 * returns STALE_UPDATE without applying any changes.
 *
 * @param store            - The current immutable transaction list.
 * @param id               - The UUID of the transaction to update.
 * @param input            - The new field values to apply.
 * @param expectedUpdatedAt - The `updatedAt` value the caller last saw.
 * @returns
 *   - `{ ok: false, error: 'NOT_FOUND' }` if no transaction with `id` exists.
 *   - `{ ok: false, error: 'STALE_UPDATE' }` if `updatedAt` has changed.
 *   - `{ ok: true, data: { store, transaction } }` on success.
 *
 * Requirements: 3.2, 3.4, 3.6
 */
export function updateTransaction(
  store: readonly Transaction[],
  id: string,
  input: TransactionInput,
  expectedUpdatedAt: string,
): ManagerResult<{ store: Transaction[]; transaction: Transaction }> {
  const index = store.findIndex((t) => t.id === id);

  if (index === -1) {
    return { ok: false, error: 'NOT_FOUND' };
  }

  const existing = store[index];

  if (existing.updatedAt !== expectedUpdatedAt) {
    return { ok: false, error: 'STALE_UPDATE' };
  }

  const updated: Transaction = {
    ...existing,          // preserve id, createdAt, and any fields not in input
    title: input.title,
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date,
    description: input.description,
    updatedAt: new Date().toISOString(),
  };

  const newStore: Transaction[] = [
    ...store.slice(0, index),
    updated,
    ...store.slice(index + 1),
  ];

  return { ok: true, data: { store: newStore, transaction: updated } };
}

// ─── deleteTransaction ────────────────────────────────────────────────────────

/**
 * Removes a transaction from the store by its unique identifier.
 *
 * @param store - The current immutable transaction list.
 * @param id    - The UUID of the transaction to remove.
 * @returns
 *   - `{ ok: false, error: 'NOT_FOUND' }` if no transaction with `id` exists.
 *   - `{ ok: true, data: { store } }` on success, with the transaction removed.
 *
 * Requirements: 4.1, 4.2
 */
export function deleteTransaction(
  store: readonly Transaction[],
  id: string,
): ManagerResult<{ store: Transaction[] }> {
  const exists = store.some((t) => t.id === id);

  if (!exists) {
    return { ok: false, error: 'NOT_FOUND' };
  }

  return {
    ok: true,
    data: { store: store.filter((t) => t.id !== id) },
  };
}

// Re-export result type for consumers that import only from manager.
export type { ManagerResult, FilterOptions };
