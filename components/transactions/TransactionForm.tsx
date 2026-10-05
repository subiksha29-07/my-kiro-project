'use client';

import { useState, useEffect } from 'react';
import type { TransactionInput, TransactionType } from '@/lib/transactions/types';
import { validateTransaction } from '@/lib/transactions/validator';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

export interface TransactionFormProps {
  initialValues?: Partial<TransactionInput> & { updatedAt?: string };
  onSubmit: (input: TransactionInput, expectedUpdatedAt?: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5';
const ERROR_CLASS = 'mt-1.5 flex items-center gap-1 text-xs text-rose-600';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function ErrorMsg({ id, msg }: { id?: string; msg: string }) {
  return (
    <p id={id} className={ERROR_CLASS} role="alert">
      <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
        <path fillRule="evenodd" d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 2.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm0 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}

export default function TransactionForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: TransactionFormProps) {
  const isEditMode = Boolean(initialValues?.updatedAt);

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [amount, setAmount] = useState(
    initialValues?.amount !== undefined ? String(initialValues.amount) : '',
  );
  const [type, setType] = useState<TransactionType>(initialValues?.type ?? 'EXPENSE');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [date, setDate] = useState(initialValues?.date ?? today());
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const valid = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (category && !(valid as readonly string[]).includes(category)) setCategory('');
  }, [type, category]);

  const categoryOptions = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function buildInput(): TransactionInput {
    const p = parseFloat(amount);
    return {
      title: title.trim(),
      amount: isNaN(p) ? 0 : p,
      type,
      category: category.trim(),
      date,
      description: description.trim() || undefined,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const input = buildInput();
    const result = validateTransaction(input);
    if (!result.valid) {
      const m: Record<string, string> = {};
      for (const err of result.errors) m[err.field] = err.message;
      setFieldErrors(m);
      return;
    }
    setFieldErrors({});
    onSubmit(input, initialValues?.updatedAt);
  }

  function revalidate(overrides?: Partial<TransactionInput>) {
    if (!submitted) return;
    const result = validateTransaction({ ...buildInput(), ...overrides });
    const m: Record<string, string> = {};
    for (const err of result.errors) m[err.field] = err.message;
    setFieldErrors(m);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditMode ? 'Edit transaction' : 'Add transaction'}
      className="space-y-5"
    >
      {/* Server error */}
      {serverError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      {/* Type selector — prominent pill toggle */}
      <div>
        <p className={LABEL_CLASS}>Type <span className="text-rose-500">*</span></p>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5 gap-0.5">
          {(['EXPENSE', 'INCOME'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); revalidate({ type: t }); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                type === t
                  ? t === 'INCOME'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white'
              }`}
            >
              {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column grid for amount + date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label htmlFor="txn-amount" className={LABEL_CLASS}>
            Amount <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm font-medium pointer-events-none">$</span>
            <input
              id="txn-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => { const v = parseFloat(amount); revalidate({ amount: isNaN(v) ? 0 : v }); }}
              className={`${INPUT_CLASS} pl-7`}
              aria-describedby={fieldErrors.amount ? 'txn-amount-err' : undefined}
              aria-invalid={Boolean(fieldErrors.amount)}
              placeholder="0.00"
            />
          </div>
          {fieldErrors.amount && <ErrorMsg id="txn-amount-err" msg={fieldErrors.amount} />}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="txn-date" className={LABEL_CLASS}>
            Date <span className="text-rose-500">*</span>
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
          {fieldErrors.date && <ErrorMsg id="txn-date-err" msg={fieldErrors.date} />}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="txn-title" className={LABEL_CLASS}>
          Title <span className="text-rose-500">*</span>
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
        {fieldErrors.title && <ErrorMsg id="txn-title-err" msg={fieldErrors.title} />}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="txn-category" className={LABEL_CLASS}>
          Category <span className="text-rose-500">*</span>
        </label>
        <select
          id="txn-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={() => revalidate({ category: category.trim() })}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.category ? 'txn-category-err' : undefined}
          aria-invalid={Boolean(fieldErrors.category)}
        >
          <option value="">— Select a category —</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {fieldErrors.category && <ErrorMsg id="txn-category-err" msg={fieldErrors.category} />}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="txn-description" className={LABEL_CLASS}>
          Description <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="txn-description"
          rows={2}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => revalidate({ description: description.trim() || undefined })}
          className={`${INPUT_CLASS} resize-none`}
          aria-describedby={fieldErrors.description ? 'txn-desc-err' : undefined}
          aria-invalid={Boolean(fieldErrors.description)}
          placeholder="Optional notes…"
        />
        <p className="mt-1 text-xs text-slate-400 text-right">{description.length}/500</p>
        {fieldErrors.description && <ErrorMsg id="txn-desc-err" msg={fieldErrors.description} />}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
            type === 'INCOME'
              ? 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500'
              : 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {isEditMode ? 'Saving…' : 'Adding…'}
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                {isEditMode
                  ? <path d="M8.954 1.545a1.875 1.875 0 1 1 2.651 2.651L10.464 5.34 6.81 1.686l1.145-1.14ZM5.775 2.72 1.5 6.994v3.256h3.256L9.03 6.496 5.775 2.72Z" />
                  : <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />}
              </svg>
              {isEditMode ? 'Save Changes' : 'Add Transaction'}
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
