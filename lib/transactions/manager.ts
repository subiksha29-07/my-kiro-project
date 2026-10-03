/**
 * Transaction business logic layer for the Smart Expense Tracker.
 * All functions are pure — they receive the current store array as a parameter
 * and return a new array. No mutation of inputs. No I/O. No React.
 *
 * Wave 3 implements: addTransaction
 * Later waves add: getTransactions, updateTransaction, deleteTransaction
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
// Implemented in Wave 4.

// ─── updateTransaction ────────────────────────────────────────────────────────
// Implemented in Wave 4.

// ─── deleteTransaction ────────────────────────────────────────────────────────
// Implemented in Wave 4.

// Re-export result type for consumers that import only from manager.
export type { ManagerResult, FilterOptions };
