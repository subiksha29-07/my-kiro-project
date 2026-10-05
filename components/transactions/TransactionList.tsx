'use client';

import type { Transaction } from '@/lib/transactions/types';
import TransactionItem from './TransactionItem';

export interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isFiltered?: boolean;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isFiltered = false,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-14 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4ZM3 10a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM3 14a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" fill="#94a3b8" />
          </svg>
        </div>
        {isFiltered ? (
          <>
            <p className="font-semibold text-slate-700">No matches for this filter</p>
            <p className="text-sm text-slate-400 mt-1">Try clearing the filters to see all transactions.</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-slate-700">No transactions recorded yet</p>
            <p className="text-sm text-slate-400 mt-1">Use the form above to add your first entry.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Transaction list">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <p className="mt-3 text-right text-xs text-slate-400">
        {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
        {isFiltered ? ' match the filter' : ' total'}
      </p>
    </section>
  );
}
