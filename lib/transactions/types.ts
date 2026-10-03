/**
 * Transaction types and shared interfaces for the Smart Expense Tracker.
 * All types are pure TypeScript — no React, no browser APIs.
 */

/** The two possible transaction classifications. */
export type TransactionType = 'INCOME' | 'EXPENSE';

/**
 * A persisted financial transaction.
 * - `id` is a UUID v4 assigned on creation and never changed.
 * - `createdAt` is set once on creation and is immutable.
 * - `updatedAt` is set on creation and updated on every edit.
 */
export interface Transaction {
  id: string;            // UUID v4 — assigned on creation
  title: string;         // 1–100 characters
  amount: number;        // > 0, ≤ 999,999,999.99, ≤ 2 decimal places
  type: TransactionType;
  category: string;      // 1–100 characters
  date: string;          // ISO 8601: YYYY-MM-DD, range 1900-01-01 – 2100-12-31
  description?: string;  // optional, max 500 characters
  createdAt: string;     // ISO 8601 timestamp — set on creation, immutable
  updatedAt: string;     // ISO 8601 timestamp — updated on every edit
}

/**
 * The write-shape used when creating or updating a transaction.
 * Does not include id, createdAt, or updatedAt — those are managed by the manager.
 */
export interface TransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

/** A single field-level validation failure. */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * The result of validating a TransactionInput.
 * When `valid` is false, `errors` contains at least one entry.
 * All failing fields are collected together — never short-circuited.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Filter options passed to getTransactions.
 * Both fields are optional; when both are provided, both must match.
 */
export interface FilterOptions {
  type?: TransactionType;
  category?: string;
}

/**
 * Discriminated union returned by manager functions that can fail.
 *
 * - `NOT_FOUND`   — no transaction with the given id exists in the store.
 * - `STALE_UPDATE` — the stored `updatedAt` differs from `expectedUpdatedAt`,
 *                    indicating a concurrent modification.
 * - `STORE_ERROR` — the persistence layer returned a failure.
 */
export type ManagerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: 'NOT_FOUND' | 'STALE_UPDATE' | 'STORE_ERROR' };
