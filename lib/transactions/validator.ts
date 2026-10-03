/**
 * Transaction validation layer for the Smart Expense Tracker.
 * Pure functions — no side effects, no React, no browser APIs.
 *
 * Rules enforced by validateTransaction:
 *   title       — non-empty string, max 100 chars
 *   amount      — finite number > 0, ≤ 999,999,999.99, at most 2 decimal places
 *   type        — exactly 'INCOME' or 'EXPENSE'
 *   category    — non-empty string, max 100 chars
 *   date        — matches YYYY-MM-DD, valid calendar date, within 1900-01-01–2100-12-31
 *   description — if present, max 500 chars
 *
 * All failing fields are collected before returning — never short-circuited.
 */

import type { TransactionInput, ValidationError, ValidationResult } from './types';

// ─── Private helpers ─────────────────────────────────────────────────────────

/** ISO 8601 date pattern: exactly YYYY-MM-DD. */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Earliest acceptable date (1900-01-01). */
const MIN_DATE = new Date('1900-01-01T00:00:00.000Z');

/** Latest acceptable date (2100-12-31). */
const MAX_DATE = new Date('2100-12-31T00:00:00.000Z');

/**
 * Returns true when the given YYYY-MM-DD string represents a valid calendar
 * date (correct month, correct day count including leap years) that falls
 * within the allowed range 1900-01-01 to 2100-12-31 inclusive.
 */
function isValidDateString(dateStr: string): boolean {
  if (!DATE_PATTERN.test(dateStr)) return false;

  // Parse as UTC midnight to avoid timezone shift.
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  // Some environments throw RangeError for out-of-range months/days (e.g. month 13).
  // Others return Invalid Date. Handle both.
  let isoDate: string;
  try {
    isoDate = date.toISOString().slice(0, 10);
  } catch {
    // RangeError: Invalid time value — the date string is invalid.
    return false;
  }

  // new Date() silently rolls over invalid dates (e.g. 2023-02-30 → 2023-03-02).
  // Confirm the parsed components still match the original string.
  if (isoDate !== dateStr) return false;

  return date >= MIN_DATE && date <= MAX_DATE;
}

/**
 * Returns true when `value` has at most 2 decimal places.
 * Uses integer arithmetic to avoid floating-point representation issues.
 */
function hasAtMostTwoDecimalPlaces(value: number): boolean {
  // Multiply by 100, round, and check for zero remainder.
  return Math.round(value * 100) === value * 100;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates all fields of a TransactionInput according to the spec rules.
 *
 * Collects every failing field before returning so the UI can display all
 * inline errors simultaneously rather than one at a time.
 *
 * @param input - The raw form data to validate.
 * @returns A ValidationResult with `valid: true` and an empty errors array on
 *          success, or `valid: false` with at least one ValidationError on failure.
 */
export function validateTransaction(input: TransactionInput): ValidationResult {
  const errors: ValidationError[] = [];

  // ── title ─────────────────────────────────────────────────────────────────
  if (typeof input.title !== 'string' || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required.' });
  } else if (input.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be at most 100 characters.' });
  }

  // ── amount ────────────────────────────────────────────────────────────────
  if (
    typeof input.amount !== 'number' ||
    !isFinite(input.amount) ||
    isNaN(input.amount)
  ) {
    errors.push({ field: 'amount', message: 'Amount must be a valid number.' });
  } else if (input.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than zero.' });
  } else if (input.amount > 999_999_999.99) {
    errors.push({ field: 'amount', message: 'Amount must be at most 999,999,999.99.' });
  } else if (!hasAtMostTwoDecimalPlaces(input.amount)) {
    errors.push({ field: 'amount', message: 'Amount must have at most two decimal places.' });
  }

  // ── type ──────────────────────────────────────────────────────────────────
  if (input.type !== 'INCOME' && input.type !== 'EXPENSE') {
    errors.push({ field: 'type', message: "Type must be 'INCOME' or 'EXPENSE'." });
  }

  // ── category ──────────────────────────────────────────────────────────────
  if (typeof input.category !== 'string' || input.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required.' });
  } else if (input.category.length > 100) {
    errors.push({ field: 'category', message: 'Category must be at most 100 characters.' });
  }

  // ── date ──────────────────────────────────────────────────────────────────
  if (typeof input.date !== 'string' || !isValidDateString(input.date)) {
    errors.push({
      field: 'date',
      message: 'Date must be a valid calendar date in YYYY-MM-DD format between 1900-01-01 and 2100-12-31.',
    });
  }

  // ── description (optional) ────────────────────────────────────────────────
  if (input.description !== undefined && input.description !== null) {
    if (typeof input.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string.' });
    } else if (input.description.length > 500) {
      errors.push({ field: 'description', message: 'Description must be at most 500 characters.' });
    }
  }

  return errors.length === 0
    ? { valid: true, errors: [] }
    : { valid: false, errors };
}
