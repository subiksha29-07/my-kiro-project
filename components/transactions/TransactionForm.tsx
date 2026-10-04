'use client';

/**
 * TransactionForm
 * Controlled form for adding or editing a transaction.
 * Runs validateTransaction() client-side and displays per-field inline errors.
 * Does NOT call addTransaction() or saveTransactions() — the parent page owns
 * those operations. This component is purely responsible for data entry and
 * calling the provided onSubmit callback with a validated TransactionInput.
 */

import { useState, useEffect } from 'react';
import type { TransactionInput, TransactionType } from '@/lib/transactions/types';
import { validateTransaction } from '@/lib/transactions/validator';
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/lib/transactions/constants';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TransactionFormProps {
  /** Pre-populate the form for edit mode. Include updatedAt for stale-update guard. */
  initialValues?: Partial<TransactionInput> & { updatedAt?: string };
  /** Called with validated input (and updatedAt for edits) when the form submits. */
  onSubmit: (input: TransactionInput, expectedUpdatedAt?: string) => void;
  /** Optional cancel handler. If not provided, the Cancel button is not shown. */
  onCancel?: () => void;
  /** Whether a save operation is in progress. Disables the submit button. */
  isSubmitting?: boolean;
  /** Error message from the parent (e.g. store failure). Displayed at top. */
  serverError?: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
const ERROR_CLASS = 'mt-1 text-xs text-red-600';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';
const REQUIRED_STAR = <span className="text-red-500 ml-0.5">*</span>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: TransactionFormProps) {
  const isEditMode = Boolean(initialValues?.updatedAt);

  // ── Controlled field state ──────────────────────────────────────────────
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [amount, setAmount] = useState(
    initialValues?.amount !== undefined ? String(initialValues.amount) : '',
  );
  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? 'EXPENSE',
  );
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [date, setDate] = useState(initialValues?.date ?? today());
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );

  // ── Validation errors ────────────────────────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Reset category when type changes if the current category isn't valid for the new type.
  useEffect(() => {
    const validCategories: readonly string[] =
      type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (category && !validCategories.includes(category)) {
      setCategory('');
    }
  }, [type, category]);

  const categoryOptions: readonly string[] =
    type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // ── Submit handler ───────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const parsedAmount = parseFloat(amount);
    const input: TransactionInput = {
      title: title.trim(),
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
      type,
      category: category.trim(),
      date,
      description: description.trim() || undefined,
    };

    const result = validateTransaction(input);

    if (!result.valid) {
      const errMap: Record<string, string> = {};
      for (const err of result.errors) {
        errMap[err.field] = err.message;
      }
      setFieldErrors(errMap);
      return;
    }

    setFieldErrors({});
    onSubmit(input, initialValues?.updatedAt);
  }

  // ── Inline validation on blur (after first submit attempt) ──────────────
  function revalidate(overrides?: Partial<TransactionInput>) {
    if (!submitted) return;
    const parsedAmount = parseFloat(amount);
    const input: TransactionInput = {
      title: title.trim(),
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
      type,
      category: category.trim(),
      date,
      description: description.trim() || undefined,
      ...overrides,
    };
    const result = validateTransaction(input);
    const errMap: Record<string, string> = {};
    for (const err of result.errors) {
      errMap[err.field] = err.message;
    }
    setFieldErrors(errMap);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditMode ? 'Edit transaction' : 'Add transaction'}
      className="space-y-4"
    >
      {/* Server-level error (e.g. storage failure) */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-300 px-4 py-2 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="txn-title" className={LABEL_CLASS}>
          Title {REQUIRED_STAR}
        </label>
        <input
          id="txn-title"
          type="text"
          autoComplete="off"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => revalidate({ title: title.trim() })}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.title ? 'txn-title-err' : undefined}
          aria-invalid={Boolean(fieldErrors.title)}
          placeholder="e.g. Monthly rent"
        />
        {fieldErrors.title && (
          <p id="txn-title-err" className={ERROR_CLASS} role="alert">
            {fieldErrors.title}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="txn-amount" className={LABEL_CLASS}>
          Amount {REQUIRED_STAR}
        </label>
        <input
          id="txn-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => {
            const v = parseFloat(amount);
            revalidate({ amount: isNaN(v) ? 0 : v });
          }}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.amount ? 'txn-amount-err' : undefined}
          aria-invalid={Boolean(fieldErrors.amount)}
          placeholder="0.00"
        />
        {fieldErrors.amount && (
          <p id="txn-amount-err" className={ERROR_CLASS} role="alert">
            {fieldErrors.amount}
          </p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="txn-type" className={LABEL_CLASS}>
          Type {REQUIRED_STAR}
        </label>
        <select
          id="txn-type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className={INPUT_CLASS}
          aria-invalid={Boolean(fieldErrors.type)}
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        {fieldErrors.type && (
          <p className={ERROR_CLASS} role="alert">
            {fieldErrors.type}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="txn-category" className={LABEL_CLASS}>
          Category {REQUIRED_STAR}
        </label>
        <select
          id="txn-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={() => revalidate({ category: category.trim() })}
          className={INPUT_CLASS}
          aria-describedby={
            fieldErrors.category ? 'txn-category-err' : undefined
          }
          aria-invalid={Boolean(fieldErrors.category)}
        >
          <option value="">— Select a category —</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {fieldErrors.category && (
          <p id="txn-category-err" className={ERROR_CLASS} role="alert">
            {fieldErrors.category}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="txn-date" className={LABEL_CLASS}>
          Date {REQUIRED_STAR}
        </label>
        <input
          id="txn-date"
          type="date"
          value={date}
          min="1900-01-01"
          max="2100-12-31"
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => revalidate({ date })}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.date ? 'txn-date-err' : undefined}
          aria-invalid={Boolean(fieldErrors.date)}
        />
        {fieldErrors.date && (
          <p id="txn-date-err" className={ERROR_CLASS} role="alert">
            {fieldErrors.date}
          </p>
        )}
      </div>

      {/* Description (optional) */}
      <div>
        <label htmlFor="txn-description" className={LABEL_CLASS}>
          Description
          <span className="ml-1 text-gray-400 font-normal text-xs">
            (optional)
          </span>
        </label>
        <textarea
          id="txn-description"
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() =>
            revalidate({ description: description.trim() || undefined })
          }
          className={INPUT_CLASS}
          aria-describedby={
            fieldErrors.description ? 'txn-desc-err' : undefined
          }
          aria-invalid={Boolean(fieldErrors.description)}
          placeholder="Optional notes"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">
          {description.length}/500
        </p>
        {fieldErrors.description && (
          <p id="txn-desc-err" className={ERROR_CLASS} role="alert">
            {fieldErrors.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
        >
          {isSubmitting
            ? isEditMode
              ? 'Saving…'
              : 'Adding…'
            : isEditMode
              ? 'Save Changes'
              : 'Add Transaction'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
