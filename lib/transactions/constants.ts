/**
 * Predefined category lists and shared constants for transaction persistence.
 * Used by the validator, manager, store, and UI components.
 */

/** Fixed income category options shown in the transaction form. */
export const INCOME_CATEGORIES: readonly string[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
] as const;

/** Fixed expense category options shown in the transaction form. */
export const EXPENSE_CATEGORIES: readonly string[] = [
  'Food',
  'Transport',
  'Housing',
  'Healthcare',
  'Entertainment',
  'Education',
  'Shopping',
  'Other Expense',
] as const;

/**
 * The localStorage key used to persist all transactions.
 * Must match the value documented in the project architecture steering document.
 */
export const STORAGE_KEY = 'smart-expense-tracker-transactions' as const;
