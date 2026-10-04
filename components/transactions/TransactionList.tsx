'use client';

/**
 * TransactionList
 * Renders a list of TransactionItem components.
 * Displays appropriate empty states when the list is empty.
 * Does NOT fetch data or call manager/store functions.
 * The parent page provides transactions and callbacks.
 */

import type { Transaction } from '@/lib/transactions/types';
import TransactionItem from './TransactionItem';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  /** True when a filter is active — affects the empty-state message. */
  isFiltered?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isFiltered = false,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3" aria-hidden="true">
          📋
        </div>
        {isFiltered ? (
          <>
            <p className="text-gray-600 font-medium">
              No transactions match the selected filter.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try clearing the filters to see all transactions.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-600 font-medium">
              No transactions recorded yet.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Add your first transaction using the form above.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Transaction list">
      <ul className="space-y-2" role="list">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <TransactionItem
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-right text-xs text-gray-400">
        {transactions.length}{' '}
        {transactions.length === 1 ? 'transaction' : 'transactions'}
        {isFiltered ? ' matching filter' : ' total'}
      </p>
    </section>
  );
}
