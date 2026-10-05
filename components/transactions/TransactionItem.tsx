'use client';

import type { Transaction } from '@/lib/transactions/types';
import { formatCurrency } from '@/lib/utils/currency';

export interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const { id, title, amount, type, category, date, description } = transaction;
  const isIncome = type === 'INCOME';
  const formattedAmount = `${isIncome ? '+' : '\u2212'}${formatCurrency(amount)}`;

  return (
    <article
      className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
      aria-label={`Transaction: ${title}`}
    >
      {/* Left: icon + details */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Icon */}
        <div className={`shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center ${
          isIncome ? 'bg-emerald-100' : 'bg-rose-100'
        }`}>
          {isIncome ? (
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M8 12V4M5 7l3-3 3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M8 4v8M5 9l3 3 3-3" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate leading-tight">{title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {category}
            </span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-xs text-slate-400">{formatDate(date)}</span>
          </div>
          {description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{description}</p>
          )}
        </div>
      </div>

      {/* Right: amount + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`font-bold text-sm tabular-nums ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formattedAmount}
        </span>

        {/* Action buttons — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            aria-label={`Edit ${title}`}
          >
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
              <path d="M8.954 1.545a1.875 1.875 0 1 1 2.651 2.651L10.464 5.34 6.81 1.686l1.145-1.14ZM5.775 2.72 1.5 6.994v3.256h3.256L9.03 6.496 5.775 2.72Z" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
            aria-label={`Delete ${title}`}
          >
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M5 1.75C5 1.336 5.336 1 5.75 1h2.5c.414 0 .75.336.75.75V3h2.25a.75.75 0 0 1 0 1.5H10.5l-.544 6.534A1.75 1.75 0 0 1 8.211 12.5H5.789a1.75 1.75 0 0 1-1.745-1.966L3.5 4.5H2.75a.75.75 0 0 1 0-1.5H5V1.75ZM6.5 2.5v.5h1v-.5h-1ZM5 4.5l.543 6.034a.25.25 0 0 0 .249.216h2.416a.25.25 0 0 0 .249-.216L9 4.5H5Z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
