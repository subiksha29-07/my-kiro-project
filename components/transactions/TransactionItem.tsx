'use client';

/**
 * TransactionItem
 * Displays a single transaction row/card.
 * Uses formatCurrency() for display. Does NOT modify storage.
 * Edit and Delete actions are passed as callbacks from the parent.
 */

import type { Transaction } from '@/lib/transactions/types';
import { formatCurrency } from '@/lib/utils/currency';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formats a YYYY-MM-DD string as "Month DD, YYYY" in the user's locale. */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const { id, title, amount, type, category, date, description } = transaction;

  const isIncome = type === 'INCOME';
  const amountPrefix = isIncome ? '+' : '\u2212'; // + or Unicode minus
  const formattedAmount = `${amountPrefix}${formatCurrency(amount)}`;

  return (
    <article
      className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
      aria-label={`Transaction: ${title}`}
    >
      {/* Left: type badge + details */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Type badge */}
        <span
          className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            isIncome
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
          aria-label={`Type: ${isIncome ? 'Income' : 'Expense'}`}
        >
          {isIncome ? 'Income' : 'Expense'}
        </span>

        {/* Title, category, date, optional description */}
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {category} &middot; {formatDate(date)}
          </p>
          {description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right: amount + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className={`font-semibold text-sm tabular-nums ${
            isIncome ? 'text-green-700' : 'text-red-700'
          }`}
          aria-label={`Amount: ${formattedAmount}`}
        >
          {formattedAmount}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
            aria-label={`Edit ${title}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="text-xs text-red-600 hover:text-red-800 hover:underline focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
            aria-label={`Delete ${title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
