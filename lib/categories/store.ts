/**
 * Custom category persistence layer.
 * Stores user-defined income and expense categories in localStorage.
 * Falls back to the hardcoded defaults when no custom categories are saved.
 */

import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/transactions/constants';

const INCOME_KEY  = 'smart-expense-tracker-income-categories'  as const;
const EXPENSE_KEY = 'smart-expense-tracker-expense-categories' as const;

function loadList(key: string, defaults: readonly string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [...defaults];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [...defaults];
    return parsed.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
  } catch {
    return [...defaults];
  }
}

function saveList(key: string, categories: string[]): { success: boolean } {
  try {
    localStorage.setItem(key, JSON.stringify(categories));
    return { success: true };
  } catch {
    return { success: false };
  }
}

export function loadIncomeCategories(): string[] {
  return loadList(INCOME_KEY, INCOME_CATEGORIES);
}

export function loadExpenseCategories(): string[] {
  return loadList(EXPENSE_KEY, EXPENSE_CATEGORIES);
}

export function saveIncomeCategories(categories: string[]): { success: boolean } {
  return saveList(INCOME_KEY, categories);
}

export function saveExpenseCategories(categories: string[]): { success: boolean } {
  return saveList(EXPENSE_KEY, categories);
}
