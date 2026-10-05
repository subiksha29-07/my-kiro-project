'use client';

import type { FilterOptions, TransactionType } from '@/lib/transactions/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

export interface TransactionFilterProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].sort();

const SELECT_CLASS =
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer';

export default function TransactionFilter({ filters, onChange }: TransactionFilterProps) {
  const hasActiveFilter = filters.type !== undefined || filters.category !== undefined;

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    onChange({ ...filters, type: v === '' ? undefined : (v as TransactionType) });
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    onChange({ ...filters, category: v === '' ? undefined : v });
  }

  return (
    <div className="flex flex-wrap items-end gap-3" role="group" aria-label="Filter transactions">
      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-type" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Type
        </label>
        <select
          id="filter-type"
          value={filters.type ?? ''}
          onChange={handleTypeChange}
          className={SELECT_CLASS}
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option value="INCOME">💚 Income</option>
          <option value="EXPENSE">🔴 Expense</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Category
        </label>
        <select
          id="filter-category"
          value={filters.category ?? ''}
          onChange={handleCategoryChange}
          className={SELECT_CLASS}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Active filter badges + clear */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 self-end pb-0.5">
          {filters.type && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
              filters.type === 'INCOME'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {filters.type === 'INCOME' ? 'Income' : 'Expense'}
              <button
                type="button"
                onClick={() => onChange({ ...filters, type: undefined })}
                className="hover:opacity-70 focus:outline-none"
                aria-label="Remove type filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filters.category}
              <button
                type="button"
                onClick={() => onChange({ ...filters, category: undefined })}
                className="hover:opacity-70 focus:outline-none"
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-xs font-medium text-slate-400 hover:text-slate-700 underline underline-offset-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
