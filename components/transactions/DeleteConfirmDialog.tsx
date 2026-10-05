'use client';

import { useEffect, useRef } from 'react';
import type { Transaction } from '@/lib/transactions/types';
import { formatCurrency } from '@/lib/utils/currency';

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

export default function DeleteConfirmDialog({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !transaction) return null;

  const { title, amount, date, type } = transaction;
  const isIncome = type === 'INCOME';
  const formattedAmount = `${isIncome ? '+' : '\u2212'}${formatCurrency(amount)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Red header stripe */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-600">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 id="delete-dialog-title" className="font-semibold text-slate-900">Delete Transaction</h2>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <p id="delete-dialog-desc" className="text-sm text-slate-600">
            Are you sure you want to permanently delete this transaction?
          </p>

          {/* Transaction preview card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate text-sm">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(date)}</p>
            </div>
            <span className={`font-bold text-sm tabular-nums shrink-0 ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formattedAmount}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Deleting…
                </>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
