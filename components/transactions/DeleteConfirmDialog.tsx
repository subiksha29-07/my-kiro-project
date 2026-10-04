'use client';

/**
 * DeleteConfirmDialog
 * Modal confirmation dialog for transaction deletion.
 * Shows transaction details to prevent accidental deletion.
 * Does NOT call deleteTransaction() — the parent supplies the onConfirm callback.
 * Supports a loading/disabled state to prevent duplicate actions.
 */

import { useEffect, useRef } from 'react';
import type { Transaction } from '@/lib/transactions/types';
import { formatCurrency } from '@/lib/utils/currency';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
  /** Disables both buttons while a delete operation is in progress. */
  isDeleting?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeleteConfirmDialog({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Move focus to Cancel button when the dialog opens.
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !transaction) return null;

  const { title, amount, date, type } = transaction;
  const formattedAmount = `${type === 'INCOME' ? '+' : '\u2212'}${formatCurrency(amount)}`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={(e) => {
        // Close on backdrop click if not deleting
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
    >
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4"
      >
        {/* Icon + heading */}
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2
            id="delete-dialog-title"
            className="text-base font-semibold text-gray-900"
          >
            Delete Transaction
          </h2>
        </div>

        {/* Description */}
        <p id="delete-dialog-desc" className="text-sm text-gray-600">
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </p>

        {/* Transaction summary */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 space-y-1">
          <p className="font-medium text-gray-800 text-sm">{title}</p>
          <p
            className={`text-sm font-semibold tabular-nums ${
              type === 'INCOME' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {formattedAmount}
          </p>
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
