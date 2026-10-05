'use client';

import { useState, useEffect, useRef } from 'react';
import { saveIncomeCategories, saveExpenseCategories } from '@/lib/categories/store';

export interface CategoryManagerProps {
  isOpen: boolean;
  incomeCategories: string[];
  expenseCategories: string[];
  onClose: () => void;
  onSave: (income: string[], expense: string[]) => void;
}

export default function CategoryManager({
  isOpen,
  incomeCategories,
  expenseCategories,
  onClose,
  onSave,
}: CategoryManagerProps) {
  const [tab, setTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [incomeText,  setIncomeText]  = useState('');
  const [expenseText, setExpenseText] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync text fields whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setIncomeText(incomeCategories.join(', '));
      setExpenseText(expenseCategories.join(', '));
      setSaved(false);
      setError(null);
    }
  }, [isOpen, incomeCategories, expenseCategories]);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [isOpen, tab]);

  if (!isOpen) return null;

  function parseCategories(text: string): string[] {
    return text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function handleSave() {
    const income  = parseCategories(incomeText);
    const expense = parseCategories(expenseText);

    if (income.length === 0) { setError('Income categories cannot be empty.'); setTab('INCOME'); return; }
    if (expense.length === 0) { setError('Expense categories cannot be empty.'); setTab('EXPENSE'); return; }

    const r1 = saveIncomeCategories(income);
    const r2 = saveExpenseCategories(expense);

    if (!r1.success || !r2.success) {
      setError('Failed to save — storage quota exceeded.');
      return;
    }

    setError(null);
    setSaved(true);
    onSave(income, expense);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  const currentText = tab === 'INCOME' ? incomeText : expenseText;
  const setCurrentText = tab === 'INCOME' ? setIncomeText : setExpenseText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-modal-title"
      onClick={handleBackdrop}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md bg-[#1a2744] rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id="cat-modal-title" className="text-lg font-bold text-white">
            {tab === 'EXPENSE' ? 'Expense' : 'Income'} categories
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Close"
          >
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
              <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L7.06 6l2.72 2.72a.75.75 0 1 1-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 0 1-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* ── Tab toggle ── */}
        <div className="flex mx-6 mb-5 rounded-xl overflow-hidden border border-white/10 bg-white/5 p-0.5 gap-0.5">
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all focus:outline-none ${
                tab === t
                  ? t === 'EXPENSE'
                    ? 'bg-rose-500 text-white shadow'
                    : 'bg-emerald-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'EXPENSE' ? '↓ Expense' : '↑ Income'}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label
              htmlFor="cat-input"
              className="block text-sm text-slate-400 mb-2"
            >
              Categories (comma separated)
            </label>
            <textarea
              id="cat-input"
              ref={textareaRef}
              rows={3}
              value={currentText}
              onChange={(e) => { setCurrentText(e.target.value); setError(null); }}
              placeholder={
                tab === 'EXPENSE'
                  ? 'e.g. Food, Transport, Housing, Healthcare'
                  : 'e.g. Salary, Freelance, Investment, Gift'
              }
              className="w-full rounded-xl bg-[#0f1c36] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20 resize-none transition-all"
            />
            {error && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
                  <path fillRule="evenodd" d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 2.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm0 5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}

            {/* Live preview chips */}
            {currentText.trim().length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {parseCategories(currentText).map((cat) => (
                  <span
                    key={cat}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      tab === 'EXPENSE'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-900'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save categories'}
          </button>

          <p className="text-center text-xs text-slate-500">
            Changes apply to both the transaction form and filters.
          </p>
        </div>
      </div>
    </div>
  );
}
