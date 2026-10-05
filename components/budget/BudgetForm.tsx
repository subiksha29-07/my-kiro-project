'use client';

import { useState } from 'react';
import { saveBudget } from '@/lib/budget/store';

interface BudgetFormProps {
  currentBudget: number | null;
  onSave: (budget: number) => void;
}

export default function BudgetForm({ currentBudget, onSave }: BudgetFormProps) {
  const [value, setValue] = useState<string>(
    currentBudget !== null ? String(currentBudget) : ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (!isFinite(parsed) || parsed <= 0) {
      setValidationError('Please enter a valid amount greater than zero.');
      return;
    }
    setValidationError(null);
    const result = saveBudget(parsed);
    if (!result.success) {
      setSaveError('Storage quota exceeded. Please free up space and try again.');
      return;
    }
    setSaveError(null);
    onSave(parsed);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="budget-input" className="block text-xs font-semibold text-slate-600 mb-1.5">
          Monthly Budget (USD)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm font-medium pointer-events-none">$</span>
          <input
            id="budget-input"
            type="number"
            min="0.01"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            placeholder="500.00"
          />
        </div>
        {validationError && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1" role="alert">
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
              <path fillRule="evenodd" d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 2.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm0 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
            </svg>
            {validationError}
          </p>
        )}
        {saveError && (
          <p className="mt-1.5 text-xs text-rose-600" role="alert">{saveError}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 transition-colors"
      >
        Save Budget
      </button>
    </form>
  );
}
