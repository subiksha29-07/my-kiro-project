/**
 * Budget persistence layer.
 * Only module that touches localStorage for budget data.
 */

const BUDGET_KEY = 'smart-expense-tracker-budget';

export function loadBudget(): number | null {
  const raw = localStorage.getItem(BUDGET_KEY);

  // Key is absent — normal first-run state, return null silently.
  if (raw === null) {
    return null;
  }

  const parsed = parseFloat(raw);

  if (isNaN(parsed) || !isFinite(parsed)) {
    console.warn('smart-expense-tracker: stored budget is not a finite number');
    return null;
  }

  if (parsed <= 0) {
    console.warn('smart-expense-tracker: stored budget is zero or negative');
    return null;
  }

  return parsed;
}

export function saveBudget(budget: number): { success: boolean } {
  try {
    localStorage.setItem(BUDGET_KEY, String(budget));
    return { success: true };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return { success: false };
    }
    // Re-throw unexpected errors
    throw error;
  }
}
