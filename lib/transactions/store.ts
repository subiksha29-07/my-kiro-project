/**
 * Transaction persistence layer for the Smart Expense Tracker.
 *
 * This is the only module in lib/ that touches browser globals (localStorage).
 * All other lib/ modules are pure TypeScript with no I/O.
 *
 * localStorage key: 'smart-expense-tracker-transactions'
 */

import type { Transaction } from './types';
import { STORAGE_KEY } from './constants';

// ─── Load ─────────────────────────────────────────────────────────────────────

/**
 * Reads and deserializes the transaction list from localStorage.
 *
 * Error recovery behaviour (each case returns [] and calls console.warn):
 *  - Key absent from localStorage
 *  - Stored string is not valid JSON
 *  - Stored value is valid JSON but not an array
 *
 * @returns The stored transaction array, or [] on any error.
 */
export function loadTransactions(): Transaction[] {
  let raw: string | null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage access itself can throw in some sandboxed environments.
    console.warn(
      `[smart-expense-tracker] Could not read "${STORAGE_KEY}" from localStorage.`,
    );
    return [];
  }

  if (raw === null) {
    // Key has never been written — this is the normal first-run state.
    // Return silently without warning (not an error condition).
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn(
      `[smart-expense-tracker] "${STORAGE_KEY}" contains malformed JSON. Resetting to empty list.`,
    );
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.warn(
      `[smart-expense-tracker] "${STORAGE_KEY}" contains valid JSON that is not an array. Resetting to empty list.`,
    );
    return [];
  }

  return parsed as Transaction[];
}

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * Serializes the transaction list and writes it to localStorage.
 *
 * @param transactions - The current in-memory transaction list to persist.
 * @returns `{ success: true }` on a successful write, or `{ success: false }`
 *          if a QuotaExceededError is thrown. Does not throw; does not modify
 *          in-memory state on failure.
 */
export function saveTransactions(
  transactions: Transaction[],
): { success: boolean } {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return { success: true };
  } catch (error) {
    // Detect localStorage quota exhaustion.
    // The error name varies slightly across browsers, so we check both the
    // standardised DOMException name and the legacy numeric code (22).
    const isDomException = error instanceof DOMException;
    const isQuota =
      isDomException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22);

    if (isQuota) {
      // Do not modify the caller's in-memory state; just signal failure.
      return { success: false };
    }

    // Unexpected error — log it but still return { success: false } so
    // the caller can handle gracefully without the app crashing.
    console.error(
      '[smart-expense-tracker] Unexpected error saving transactions:',
      error,
    );
    return { success: false };
  }
}
