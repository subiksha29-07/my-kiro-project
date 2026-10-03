# Implementation Plan: Monthly Budget

## Overview

Implements the Monthly Budget feature on top of the completed Transaction Management and Dashboard specs. All tasks assume `lib/transactions/types.ts`, `lib/transactions/store.ts`, `lib/dashboard/calculator.ts`, and `lib/utils/currency.ts` already exist. Tasks proceed strictly bottom-up: persistence → business logic → unit tests → property-based tests → UI components → page integration.

Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Vitest + fast-check.

---

## Tasks

- [ ] 1. Implement Budget persistence layer (`lib/budget/store.ts`)
  - [ ] 1.1 Create `lib/budget/store.ts`
    - Define `const BUDGET_KEY = 'smart-expense-tracker-budget'` (matches the localStorage key from the architecture spec).
    - Export `loadBudget(): number | null`:
      - Call `localStorage.getItem(BUDGET_KEY)`.
      - If key is absent (`null`): return `null` silently.
      - Parse with `parseFloat`; if the result is `NaN` or `!isFinite(result)`: call `console.warn('smart-expense-tracker: stored budget is not a finite number')` and return `null`.
      - If the parsed value is `≤ 0`: call `console.warn('smart-expense-tracker: stored budget is zero or negative')` and return `null`.
      - Otherwise return the parsed number.
    - Export `saveBudget(budget: number): { success: boolean }`:
      - Call `localStorage.setItem(BUDGET_KEY, String(budget))`.
      - Catch any `DOMException` where `error.name === 'QuotaExceededError'`: return `{ success: false }` without throwing.
      - On success return `{ success: true }`.
    - No React imports. No `Transaction` imports. Pure persistence.
    - File: `lib/budget/store.ts`
    - _Requirements: 1.5, 1.7, 2.1, 2.2, 2.3, 2.4_
    - _Acceptance: TypeScript compiles (`npx tsc --noEmit` exits 0); no React or UI imports in the file_

- [ ] 2. Write unit tests for `lib/budget/store.ts`
  - [ ] 2.1 Create `__tests__/budget/store.test.ts`
    - Use `vi.stubGlobal('localStorage', localStorageMock)` pattern from testing conventions; reset mock in `beforeEach`.
    - `loadBudget` — key absent → returns `null`, does NOT warn.
    - `loadBudget` — stored value is non-numeric string (e.g. `'abc'`) → returns `null`, calls `console.warn`.
    - `loadBudget` — stored value is `'NaN'` → returns `null`, calls `console.warn`.
    - `loadBudget` — stored value is `'Infinity'` → returns `null`, calls `console.warn`.
    - `loadBudget` — stored value is `'0'` → returns `null`, calls `console.warn`.
    - `loadBudget` — stored value is `'-100'` → returns `null`, calls `console.warn`.
    - `loadBudget` — stored value is `'500.00'` → returns `500`.
    - `saveBudget` — successful write → returns `{ success: true }`, `localStorage.setItem` called with correct key and stringified value.
    - `saveBudget` — `QuotaExceededError` thrown → returns `{ success: false }`, does not throw.
    - File: `__tests__/budget/store.test.ts`
    - _Requirements: 1.5, 1.7, 2.1, 2.2, 2.3, 2.4_
    - _Acceptance: All tests pass with `npm run test`; `console.warn` asserted via `vi.spyOn(console, 'warn')`_

- [ ] 3. Implement budget business logic (`lib/budget/manager.ts`)
  - [ ] 3.1 Export `BudgetStatus` type and `BudgetEvaluation` interface
    - Export `export type BudgetStatus = 'WITHIN_BUDGET' | 'OVER_BUDGET' | 'NO_BUDGET'`.
    - Export `export interface BudgetEvaluation { monthlyExpenses: number; budget: number | null; status: BudgetStatus; remaining: number | null; overspend: number | null; percentage: number }`.
    - File: `lib/budget/manager.ts`
    - _Requirements: 4.1, 4.2, 4.3_
    - _Acceptance: Types importable without TypeScript error_

  - [ ] 3.2 Implement `computeMonthlyExpenses`
    - Export `computeMonthlyExpenses(transactions: Transaction[], yearMonth: string): number`.
    - Filter: `t.type === 'EXPENSE'` AND `typeof t.date === 'string' && t.date.startsWith(yearMonth)`.
    - Transactions with missing or non-string `date` are silently excluded (no throw, no warn).
    - Sum the `amount` of all passing transactions. Return `0` when none match.
    - Pure function — no `Date`, no `localStorage`, no React.
    - File: `lib/budget/manager.ts`
    - _Requirements: 3.1, 3.2, 3.4_
    - _Acceptance: Accepts any `yearMonth` string; INCOME transactions excluded; malformed date silently excluded_

  - [ ] 3.3 Implement `evaluateBudget`
    - Export `evaluateBudget(transactions: Transaction[], budget: number | null, yearMonth: string): BudgetEvaluation`.
    - Call `computeMonthlyExpenses(transactions, yearMonth)` to get `monthlyExpenses`.
    - If `budget` is `null`: return `{ monthlyExpenses, budget: null, status: 'NO_BUDGET', remaining: null, overspend: null, percentage: 0 }`.
    - Compute `percentage = (monthlyExpenses / budget) * 100` (budget is guaranteed > 0 here since store returns null for ≤ 0).
    - If `monthlyExpenses <= budget`: return `{ ..., status: 'WITHIN_BUDGET', remaining: budget - monthlyExpenses, overspend: null, percentage }`.
    - If `monthlyExpenses > budget`: return `{ ..., status: 'OVER_BUDGET', remaining: null, overspend: monthlyExpenses - budget, percentage }`.
    - Pure function — `yearMonth` is always injected by the caller; no `new Date()` calls inside.
    - File: `lib/budget/manager.ts`
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.5, 4.6, 5.1_

  - [ ] 3.4 Implement `getCurrentYearMonth`
    - Export `getCurrentYearMonth(): string`.
    - Return `new Date()` formatted as `'YYYY-MM'` using the device local time: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`.
    - This function is called only at page/component level — never inside `evaluateBudget` or `computeMonthlyExpenses`.
    - File: `lib/budget/manager.ts`
    - _Requirements: 3.1 (CurrentMonth is derived from device local time)_
    - _Acceptance: Returns a string matching `/^\d{4}-\d{2}$/`; result for October 2026 is `'2026-10'`_

- [ ] 4. Write unit tests for `lib/budget/manager.ts`
  - [ ] 4.1 Create `__tests__/budget/manager.test.ts`
    - `computeMonthlyExpenses`:
      - No transactions → returns `0`.
      - One EXPENSE in `'2026-10'`, `yearMonth = '2026-10'` → returns that amount.
      - Two EXPENSEs in `'2026-10'` → returns their sum.
      - EXPENSE in `'2026-09'`, `yearMonth = '2026-10'` → returns `0` (other month excluded).
      - INCOME in `'2026-10'`, `yearMonth = '2026-10'` → returns `0` (type excluded).
      - Transaction with `date = undefined` → excluded, no error thrown.
      - Transaction with `date = ''` → excluded, no error thrown.
    - `evaluateBudget`:
      - `budget = null` → `{ status: 'NO_BUDGET', remaining: null, overspend: null, percentage: 0 }`.
      - `monthlyExpenses < budget` → `{ status: 'WITHIN_BUDGET', remaining: budget - monthlyExpenses, overspend: null }`.
      - `monthlyExpenses === budget` → `{ status: 'WITHIN_BUDGET', remaining: 0, overspend: null }`.
      - `monthlyExpenses > budget` → `{ status: 'OVER_BUDGET', remaining: null, overspend: monthlyExpenses - budget }`.
      - `percentage` when `monthlyExpenses = 75`, `budget = 100` → `percentage = 75`.
      - `percentage` when `monthlyExpenses = 150`, `budget = 100` → `percentage = 150`.
    - File: `__tests__/budget/manager.test.ts`
    - _Requirements: 3.1, 3.2, 3.4, 4.1, 4.2, 4.3, 4.5, 4.6, 5.1_
    - _Acceptance: All tests pass; each assertion targets a specific requirement_

- [ ] 5. Write property-based tests for `lib/budget/manager.ts`
  - Create `__tests__/budget/manager.pbt.ts`; import from `__tests__/arbitraries.ts`; each property uses `numRuns: 100` minimum.

  - [ ]* 5.1 Write PBT — Property 1: Non-Negative Monthly Expenses
    - **Property 1: `monthlyExpenses >= 0` for any transaction list and any `yearMonth`**
    - Use `arbitraryTransactionList()` and `arbitraryYearMonth()` arbitraries.
    - Call `computeMonthlyExpenses(transactions, yearMonth)` and assert result `>= 0`.
    - **Validates: Requirements 3.1, 3.2**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.2 Write PBT — Property 2: Status Consistency
    - **Property 2: `status === 'WITHIN_BUDGET'` iff `monthlyExpenses <= budget` (when `budget > 0`)**
    - Use `arbitraryTransactionList()`, `arbitraryYearMonth()`, and `arbitraryBudget()`.
    - Call `evaluateBudget(transactions, budget, yearMonth)`; assert `(result.status === 'WITHIN_BUDGET') === (result.monthlyExpenses <= budget)`.
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.3 Write PBT — Property 3: Remaining Non-Negative
    - **Property 3: `remaining >= 0` whenever `status === 'WITHIN_BUDGET'`**
    - Use `arbitraryTransactionList()`, `arbitraryYearMonth()`, `arbitraryBudget()`.
    - Call `evaluateBudget`; when `result.status === 'WITHIN_BUDGET'`, assert `result.remaining !== null && result.remaining >= 0`.
    - **Validates: Requirements 4.5**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.4 Write PBT — Property 4: Overspend Non-Negative
    - **Property 4: `overspend >= 0` whenever `status === 'OVER_BUDGET'`**
    - Use `arbitraryTransactionList()`, `arbitraryYearMonth()`, `arbitraryBudget()`.
    - Call `evaluateBudget`; when `result.status === 'OVER_BUDGET'`, assert `result.overspend !== null && result.overspend >= 0`.
    - **Validates: Requirements 4.6**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.5 Write PBT — Property 5: Percentage Bound
    - **Property 5: `percentage >= 0` always; visual fill width is `Math.min(percentage, 100)`, which is always `<= 100`**
    - Use `arbitraryTransactionList()`, `arbitraryYearMonth()`, `arbitraryBudget()`.
    - Call `evaluateBudget`; assert `result.percentage >= 0` and `Math.min(result.percentage, 100) <= 100`.
    - **Validates: Requirements 5.1, 5.2**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.6 Write PBT — Property 6: Adding Expense Increases Monthly Total
    - **Property 6: After adding an EXPENSE with a date in `yearMonth`, `newMonthlyExpenses === oldMonthlyExpenses + amount` (within 1e-9)**
    - Use `arbitraryTransactionList()`, `arbitraryYearMonth()`, and `arbitraryAmount()`.
    - Build an EXPENSE transaction whose `date` starts with `yearMonth`; compute old total; add to list; compute new total.
    - Assert `Math.abs(newTotal - (oldTotal + amount)) < 1e-9`.
    - **Validates: Requirements 3.1, 6.1**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 5.7 Write PBT — Property 7: Expenses in Other Months Excluded
    - **Property 7: Transactions whose `date` does not start with `yearMonth` do not affect `monthlyExpenses`**
    - Use `arbitraryTransactionList()` and `arbitraryYearMonth()`.
    - Filter the generated list to keep only transactions outside `yearMonth`; assert `computeMonthlyExpenses(outsideList, yearMonth) === 0`.
    - **Validates: Requirements 3.1**
    - File: `__tests__/budget/manager.pbt.ts`
    - _Acceptance: Property passes 100 runs without counterexample_

- [ ] 6. Checkpoint — all lib/budget tests pass
  - Run `npm run test`. All tests in `__tests__/budget/` (store, manager, manager.pbt) must pass before proceeding to UI components.

- [ ] 7. Implement `BudgetProgressBar` component
  - [ ] 7.1 Create `components/budget/BudgetProgressBar.tsx`
    - `'use client'` component.
    - Props: `percentage: number`, `status: BudgetStatus`.
    - Do NOT render the bar when `status === 'NO_BUDGET'` (returns `null`) — division-by-zero guard (Req 5.2).
    - Visual fill width: `Math.min(percentage, 100)` converted to a `%` string (CSS `width` style or Tailwind arbitrary value).
    - Fill colour determined by `percentage` band:
      - `0 < percentage <= 75` → green (e.g. `bg-green-500`)
      - `75 < percentage <= 100` → amber (e.g. `bg-amber-500`)
      - `percentage > 100` → red (e.g. `bg-red-500`)
    - Display label: `Math.floor(percentage)%` next to the bar (Req 5.6 requires `Math.floor`, not `Math.round`).
    - File: `components/budget/BudgetProgressBar.tsx`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
    - _Acceptance: Returns `null` when `status === 'NO_BUDGET'`; green for 50%, amber for 90%, red for 110%; label uses `Math.floor`; width capped at 100% visually_

- [ ] 8. Implement `BudgetForm` component
  - [ ] 8.1 Create `components/budget/BudgetForm.tsx`
    - `'use client'` component.
    - Props: `currentBudget: number | null`, `onSave: (budget: number) => void`.
    - Render a controlled `<input type="number" min="0.01" step="0.01">`.
    - Pre-populate the input with `currentBudget` if non-null.
    - Client-side validation before calling `saveBudget`:
      - Value must be a finite number > 0 (Req 1.2, 1.3, 1.4).
      - On failure: render an inline error message; do NOT call `saveBudget` or `onSave`.
    - On valid submit: call `saveBudget(value)` from `@/lib/budget/store`.
      - If `{ success: false }`: display an error message and retain the current input value (Req 1.7).
      - If `{ success: true }`: call `onSave(value)`.
    - File: `components/budget/BudgetForm.tsx`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
    - _Acceptance: Inline error appears for 0, negative, NaN, and Infinity inputs; successful save calls `onSave` with the parsed number; failed save retains value and shows error_

- [ ] 9. Implement `BudgetWidget` component
  - [ ] 9.1 Create `components/budget/BudgetWidget.tsx`
    - `'use client'` component.
    - Props: `evaluation: BudgetEvaluation`, `onBudgetChange: (budget: number) => void`, `error?: string | null`.
    - Render a status badge with colour-coded background:
      - `WITHIN_BUDGET` → green badge
      - `OVER_BUDGET` → red badge
      - `NO_BUDGET` → neutral grey badge
    - Display formatted `monthlyExpenses` (via `formatCurrency` from `@/lib/utils/currency`).
    - When `status === 'NO_BUDGET'`: render `<BudgetForm currentBudget={null} onSave={onBudgetChange} />` with a prompt ("Set a monthly budget to track your spending").
    - When `status === 'WITHIN_BUDGET'`: display budget amount, remaining amount (formatted, Req 4.5), and `<BudgetProgressBar>`. Show "Edit Budget" toggle button that reveals `<BudgetForm>`.
    - When `status === 'OVER_BUDGET'`: display budget amount, overspend amount (formatted, Req 4.6), and `<BudgetProgressBar>`. Show "Edit Budget" toggle button.
    - When `error` prop is non-null: display the error message in a visible alert; continue displaying last-known evaluation values (Req 6.3).
    - File: `components/budget/BudgetWidget.tsx`
    - _Requirements: 1.6, 3.3, 4.4, 4.5, 4.6, 5.1–5.6, 6.3_
    - _Acceptance: All three `status` states render distinct content; remaining shown for WITHIN_BUDGET; overspend shown for OVER_BUDGET; error prop renders alert without losing displayed data_

- [ ] 10. Integrate BudgetWidget into Dashboard page (`app/page.tsx`)
  - [ ] 10.1 Add budget state to `app/page.tsx`
    - Extend existing Dashboard page state with:
      ```typescript
      const [budget, setBudget] = useState<number | null>(null);
      const [budgetError, setBudgetError] = useState<string | null>(null);
      ```
    - On mount (inside the existing `useEffect` or a new one): call `loadBudget()` from `@/lib/budget/store` and set `budget`.
    - File: `app/page.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
    - _Acceptance: `budget` state is populated from localStorage on page load; non-null on a session that previously saved a valid budget_

  - [ ] 10.2 Compute `BudgetEvaluation` and render `BudgetWidget`
    - Compute `const evaluation = evaluateBudget(transactions, budget, getCurrentYearMonth())` — derived value, not state.
    - Wrap the call in a try/catch; on error set `budgetError`, retain last known `evaluation` via a `lastGoodEvaluation` ref or state variable.
    - Clear `budgetError` on next successful computation.
    - Render `<BudgetWidget evaluation={evaluation} onBudgetChange={handleBudgetChange} error={budgetError} />` below `<BalanceSummary>`.
    - File: `app/page.tsx`
    - _Requirements: 3.1, 3.3, 4.1–4.6, 5.1–5.6, 6.1, 6.2, 6.3_
    - _Acceptance: Widget re-renders with updated status whenever `transactions` or `budget` state changes; budget persists across page reloads_

  - [ ] 10.3 Implement `handleBudgetChange` callback
    - When `onBudgetChange(newBudget)` is called by `BudgetWidget`: call `saveBudget(newBudget)`.
    - If `{ success: false }`: set `budgetError` to an error string; do NOT update `budget` state.
    - If `{ success: true }`: call `setBudget(newBudget)`, clear `budgetError`.
    - File: `app/page.tsx`
    - _Requirements: 1.5, 1.6, 1.7, 6.2_
    - _Acceptance: Valid budget save updates `budget` state and widget re-renders with new status; quota-exceeded error shows error message and retains previous budget_

- [ ] 11. Final checkpoint — full test suite passes
  - Run `npm run test`. All tests across `__tests__/budget/store.test.ts`, `__tests__/budget/manager.test.ts`, and `__tests__/budget/manager.pbt.ts` must pass. Verify the Dashboard page renders the `BudgetWidget` correctly with `npm run dev`.

---

## Notes

- Tasks marked with `*` are property-based tests and are optional for a minimal MVP, but all 7 properties should pass before declaring the feature complete.
- `evaluateBudget` must never call `new Date()` — inject `yearMonth` from `getCurrentYearMonth()` at the page level only. This keeps all manager functions pure and trivially testable.
- `saveBudget` and `saveTransactions` follow the same `{ success: boolean }` return pattern — do not use void or throw.
- `BudgetProgressBar` must use `Math.floor` (not `Math.round`) for the percentage label to satisfy Req 5.6 exactly.
- The `BudgetWidget` integrates into `app/page.tsx` alongside the existing `BalanceSummary` — do not create a separate dashboard page.
- Depends on: `lib/transactions/types.ts`, `lib/transactions/store.ts`, `lib/dashboard/calculator.ts`, `lib/utils/currency.ts` (all from prior specs).

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "3.4"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7"] },
    { "id": 6, "tasks": ["7.1", "8.1"] },
    { "id": 7, "tasks": ["9.1"] },
    { "id": 8, "tasks": ["10.1"] },
    { "id": 9, "tasks": ["10.2", "10.3"] }
  ]
}
```
