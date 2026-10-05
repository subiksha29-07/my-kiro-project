'use client';

import { useState, useEffect } from 'react';
import { loadTransactions, saveTransactions } from '@/lib/transactions/store';
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '@/lib/transactions/manager';
import { validateTransaction } from '@/lib/transactions/validator';
import {
  loadIncomeCategories,
  loadExpenseCategories,
} from '@/lib/categories/store';
import type { Transaction, TransactionInput, FilterOptions } from '@/lib/transactions/types';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionFilter from '@/components/transactions/TransactionFilter';
import DeleteConfirmDialog from '@/components/transactions/DeleteConfirmDialog';
import CategoryManager from '@/components/settings/CategoryManager';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);

  useEffect(() => {
    try {
      setTransactions(loadTransactions());
    } catch {
      setLoadError('Failed to load transactions from storage.');
    }
    setIncomeCategories(loadIncomeCategories());
    setExpenseCategories(loadExpenseCategories());
  }, []);

  const displayedTransactions = getTransactions(transactions, filters);
  const isFiltered = !!(filters.type || filters.category);
  const allCategories = Array.from(new Set([...incomeCategories, ...expenseCategories])).sort();

  async function handleSubmit(input: TransactionInput, expectedUpdatedAt?: string) {
    if (!validateTransaction(input).valid) return;
    setIsSubmitting(true);
    try {
      if (editTarget && expectedUpdatedAt) {
        const result = updateTransaction(transactions, editTarget.id, input, expectedUpdatedAt);
        if (!result.ok) {
          if (result.error === 'STALE_UPDATE') {
            setTransactions(loadTransactions());
            setServerError('Transaction modified elsewhere. Please try again.');
          } else {
            setServerError(result.error === 'NOT_FOUND' ? 'Transaction not found.' : 'Failed to save.');
          }
          return;
        }
        if (!saveTransactions(result.data.store).success) {
          setServerError('Failed to save to storage. Please try again.');
          return;
        }
        setTransactions(result.data.store);
        setEditTarget(null);
        setShowForm(false);
        setServerError(null);
      } else {
        const result = addTransaction(transactions, input);
        if (!saveTransactions(result.store).success) {
          setServerError('Failed to save to storage. Please try again.');
          return;
        }
        setTransactions(result.store);
        setShowForm(false);
        setServerError(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(transaction: Transaction) {
    setEditTarget(transaction);
    setShowForm(true);
    setServerError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditTarget(null);
    setShowForm(false);
    setServerError(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = deleteTransaction(transactions, deleteTarget);
      if (!result.ok) { setDeleteTarget(null); return; }
      if (!saveTransactions(result.data.store).success) return;
      setTransactions(result.data.store);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCategorySave(income: string[], expense: string[]) {
    setIncomeCategories(income);
    setExpenseCategories(expense);
  }

  const deleteTargetTransaction = deleteTarget
    ? (transactions.find((t) => t.id === deleteTarget) ?? null)
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 flex items-end justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium uppercase tracking-wider mb-1">Manage your money</p>
            <h1 className="text-3xl font-bold">Transactions</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-violet-200">
              <span className="font-semibold text-white text-xl">{transactions.length}</span>{' '}
              {transactions.length === 1 ? 'entry' : 'entries'}
            </span>
            {/* Manage Categories button */}
            <button
              type="button"
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Manage categories"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75Zm0 4A.75.75 0 0 1 2.75 7h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 7.75Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 2 11.75ZM14.78 9.22a.75.75 0 0 0-1.06 0l-1.97 1.97-.47-.47a.75.75 0 0 0-1.06 1.06l1 1a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
              </svg>
              Categories
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Load error */}
        {loadError && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
            </svg>
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: form panel ── */}
          <aside className="lg:col-span-2">
            {!showForm && (
              <button
                type="button"
                onClick={() => { setEditTarget(null); setShowForm(true); }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 hover:bg-violet-100 hover:border-violet-400 py-4 text-sm font-semibold text-violet-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 mb-4"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                New Transaction
              </button>
            )}

            {showForm && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${editTarget ? 'bg-amber-50' : 'bg-violet-50'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${editTarget ? 'bg-amber-200' : 'bg-violet-200'}`}>
                      <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3.5 h-3.5 ${editTarget ? 'text-amber-700' : 'text-violet-700'}`}>
                        {editTarget
                          ? <path d="M8.954 1.545a1.875 1.875 0 1 1 2.651 2.651L10.464 5.34 6.81 1.686l1.145-1.14ZM5.775 2.72 1.5 6.994v3.256h3.256L9.03 6.496 5.775 2.72Z" />
                          : <path d="M6.75 3a.75.75 0 0 0-1.5 0v2.25H3a.75.75 0 0 0 0 1.5h2.25V9a.75.75 0 0 0 1.5 0V6.75H9a.75.75 0 0 0 0-1.5H6.75V3Z" />}
                      </svg>
                    </div>
                    <h2 className={`text-sm font-semibold ${editTarget ? 'text-amber-800' : 'text-violet-800'}`}>
                      {editTarget ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                    aria-label="Close form"
                  >
                    <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                      <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L7.06 6l2.72 2.72a.75.75 0 1 1-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 0 1-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                </div>
                <div className="px-5 py-5">
                  <TransactionForm
                    key={editTarget?.id ?? 'add'}
                    initialValues={editTarget ?? undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelEdit}
                    isSubmitting={isSubmitting}
                    serverError={serverError}
                    incomeCategories={incomeCategories}
                    expenseCategories={expenseCategories}
                  />
                </div>
              </div>
            )}
          </aside>

          {/* ── Right: list ── */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3.5">
              <TransactionFilter
                filters={filters}
                onChange={setFilters}
                allCategories={allCategories}
              />
            </div>
            <TransactionList
              transactions={displayedTransactions}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              isFiltered={isFiltered}
            />
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        transaction={deleteTargetTransaction}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <CategoryManager
        isOpen={showCategoryManager}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        onClose={() => setShowCategoryManager(false)}
        onSave={handleCategorySave}
      />
    </div>
  );
}
