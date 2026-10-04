'use client';

/**
 * TransactionFilter
 * Reusable filtering UI for the transaction list.
 * Receives current filter values and an onChange callback.
 * Does NOT call getTransactions() — the parent page applies filters.
 */

import type { FilterOptions, TransactionType } from '@/lib/transactions/types';
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/lib/transactions/constants';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TransactionFilterProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].sort();

const SELECT_CLASS =
  'border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionFilter({
  filters,
  onChange,
}: TransactionFilterProps) {
  const hasActiveFilter = filters.type !== undefined || filters.category !== undefined;

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onChange({
      ...filters,
      type: value === '' ? undefined : (value as TransactionType),
    });
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onChange({
      ...filters,
      category: value === '' ? undefined : value,
    });
  }

  function handleClear() {
    onChange({});
  }

  return (
    <div
      className="flex flex-wrap items-end gap-3"
      role="group"
      aria-label="Filter transactions"
    >
      {/* Type filter */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-type"
          className="text-xs font-medium text-gray-600"
        >
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
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-category"
          className="text-xs font-medium text-gray-600"
        >
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
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters button — only shown when a filter is active */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="self-end text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-2"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
