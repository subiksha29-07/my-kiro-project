# Design Document: Monthly Budget

## Overview

The Monthly Budget feature adds a budget-setting control and a status widget to the Dashboard. A pure `Budget_Manager` module handles all calculations. The budget value is persisted in `localStorage`. The feature is intentionally thin — no server routes, no complex state.

---

## Architecture

```
app/page.tsx                    ← Dashboard page (hosts BudgetWidget)
  └─ components/budget/
       ├─ BudgetWidget.tsx       ← Summary: status, progress bar, remaining/overspend
       ├─ BudgetForm.tsx         ← Input to set/update the budget
       └─ BudgetProgressBar.tsx  ← Visual progress indicator
lib/budget/
  ├─ manager.ts                 ← Pure budget calculation functions (no I/O)
  └─ store.ts                   ← localStorage read/write for budget value
```

---

## Data Models

```typescript
// lib/budget/manager.ts

import type { Transaction } from '@/lib/transactions/types';

/**
 * BudgetStatus applies as follows:
 * - NO_BUDGET:      budget is null OR stored budget is ≤ 0
 * - WITHIN_BUDGET:  budget > 0 AND monthlyExpenses ≤ budget
 * - OVER_BUDGET:    budget > 0 AND monthlyExpenses > budget
 *
 * Callers must pass null if the stored budget is ≤ 0.
 * The Budget_Store already performs this guard before returning.
 */
export type BudgetStatus = 'WITHIN_BUDGET' | 'OVER_BUDGET' | 'NO_BUDGET';

export interface BudgetEvaluation {
  monthlyExpenses: number;    // sum of EXPENSE amounts in the current month; ≥ 0
  budget: number | null;      // null when no budget is set or stored budget ≤ 0
  status: BudgetStatus;
  remaining: number | null;   // (budget − monthlyExpenses); positive when WITHIN_BUDGET
  overspend: number | null;   // (monthlyExpenses − budget); positive when OVER_BUDGET
  percentage: number;         // (monthlyExpenses / budget) * 100; 0 when NO_BUDGET; may exceed 100
}
```

```typescript
// lib/budget/store.ts

const BUDGET_KEY = 'smart-expense-tracker-budget';

export function loadBudget(): number | null
export function saveBudget(budget: number): { success: boolean }
```

---

## Components and Interfaces

### Persistence Layer (`lib/budget/store.ts`)

- **`loadBudget()`**: reads `localStorage` key, parses as `parseFloat`. Returns `null` if absent, non-numeric, `NaN`, `Infinity`, or `≤ 0`. Calls `console.warn` with a descriptive message on any malformed or out-of-range value.
- **`saveBudget(budget)`**: serialises budget as a string and writes to `localStorage`. On `QuotaExceededError`, returns `{ success: false }` without throwing. Returns `{ success: true }` on success. The UI checks the return value and shows an error message if `!success`.

### Business Logic Layer (`lib/budget/manager.ts`)

```typescript
export function computeMonthlyExpenses(
  transactions: Transaction[],
  yearMonth: string         // format: 'YYYY-MM'
): number

export function evaluateBudget(
  transactions: Transaction[],
  budget: number | null,
  yearMonth: string
): BudgetEvaluation

export function getCurrentYearMonth(): string
```

**`computeMonthlyExpenses` behaviour:**
- Filters `type === 'EXPENSE'` AND `date.startsWith(yearMonth)`.
- Transactions with a missing or non-string `date` field are silently excluded: `if (!t.date || typeof t.date !== 'string') return false`.
- Sums the `amount` of matching transactions. Returns `0` if none match.

**`evaluateBudget` behaviour:**
1. Calls `computeMonthlyExpenses(transactions, yearMonth)`.
2. If `budget` is `null`: returns `{ status: 'NO_BUDGET', remaining: null, overspend: null, percentage: 0 }`.
3. If `monthlyExpenses <= budget`: returns `{ status: 'WITHIN_BUDGET', remaining: budget − monthlyExpenses, overspend: null }`.
4. If `monthlyExpenses > budget`: returns `{ status: 'OVER_BUDGET', remaining: null, overspend: monthlyExpenses − budget }`.
5. `percentage = budget > 0 ? (monthlyExpenses / budget) * 100 : 0`.

**`getCurrentYearMonth()`**: returns the device-local current month as `'YYYY-MM'`. Called only at page/component level — never inside lib functions (keeps `evaluateBudget` pure and testable).

### UI Components

#### `BudgetForm` (`components/budget/BudgetForm.tsx`)

```tsx
interface BudgetFormProps {
  currentBudget: number | null;
  onSave: (budget: number) => void;
}
```

- Controlled `<input type="number" min="0.01" step="0.01">`.
- Client-side validation: must be > 0 and finite; shows inline error otherwise.
- Pre-populates with `currentBudget` if set.
- On submit: calls `saveBudget(value)`, checks `{ success }`, then calls `onSave(value)` on success or shows error on failure.

#### `BudgetProgressBar` (`components/budget/BudgetProgressBar.tsx`)

```tsx
interface BudgetProgressBarProps {
  percentage: number;   // 0–100+; visual width is capped at 100%
  status: BudgetStatus;
}
```

- Visual fill width: `Math.min(percentage, 100)%`.
- Fill colour by band:
  - 0 < percentage ≤ 75 → green
  - 75 < percentage ≤ 100 → amber
  - percentage > 100 → red
- Label: `Math.floor(percentage)%` displayed next to bar.
- Not rendered when `status === 'NO_BUDGET'` (budget = 0 / null guard prevents division by zero).

#### `BudgetWidget` (`components/budget/BudgetWidget.tsx`)

```tsx
interface BudgetWidgetProps {
  evaluation: BudgetEvaluation;
  onBudgetChange: (budget: number) => void;
  error?: string | null;
}
```

- Displays: status badge (colour-coded), formatted `monthlyExpenses`, formatted `budget`, remaining or overspend amount, and `BudgetProgressBar`.
- When `status === 'NO_BUDGET'`: renders `BudgetForm` with a prompt to set a budget.
- When budget is set: shows current budget and an "Edit Budget" toggle that reveals `BudgetForm`.
- When `error` is non-null: displays the error message and retains the last known `BudgetEvaluation` values until a successful recalculation (Req 6.3).

### Dashboard Page Integration (`app/page.tsx`)

Additional state for budget:

```typescript
const [budget, setBudget] = useState<number | null>(null);
const [budgetError, setBudgetError] = useState<string | null>(null);
```

On mount: calls `loadBudget()` and sets `budget`. On `onBudgetChange`: calls `saveBudget`, checks `{ success }`, updates `budget` state if successful or sets `budgetError` if not. Passes `evaluateBudget(transactions, budget, getCurrentYearMonth())` to `BudgetWidget`. Re-evaluates automatically whenever `transactions` or `budget` state changes.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Budget input = 0 or negative | `BudgetForm` shows inline validation error; `saveBudget` not called |
| Budget input = NaN / Infinity | `BudgetForm` shows inline validation error; `saveBudget` not called |
| `saveBudget` quota error | Returns `{ success: false }`; UI shows error toast; previous budget value retained |
| `loadBudget` — malformed value | Returns `null`; `console.warn` logged; widget shows NO_BUDGET state |
| `loadBudget` — stored value ≤ 0 | Returns `null`; `console.warn` logged; widget shows NO_BUDGET state |
| Recalculation failure | `budgetError` set; last known `BudgetEvaluation` displayed; error message shown |
| Transaction with malformed date | `computeMonthlyExpenses` silently excludes it; no error thrown |

---

## Correctness Properties

Implemented as property-based tests in `__tests__/budget/manager.pbt.ts` using **fast-check**:

### Property 1: Non-Negative Monthly Expenses
**Validates: Requirements 3.1, 3.2**
`monthlyExpenses >= 0` for any transaction list and any yearMonth string.

### Property 2: Status Consistency
**Validates: Requirements 4.1, 4.2, 4.3**
`status === 'WITHIN_BUDGET'` if and only if `monthlyExpenses <= budget` (when `budget > 0`).

### Property 3: Remaining Non-Negative
**Validates: Requirements 4.5**
`remaining >= 0` whenever `status === 'WITHIN_BUDGET'` — remaining is never negative.

### Property 4: Overspend Non-Negative
**Validates: Requirements 4.6**
`overspend >= 0` whenever `status === 'OVER_BUDGET'` — overspend is never negative.

### Property 5: Percentage Bound
**Validates: Requirements 5.1, 5.2**
`percentage >= 0` always; the visual progress bar fill is capped at 100% regardless of how large `percentage` becomes.

### Property 6: Adding Expense Increases Monthly Total
**Validates: Requirements 3.1, 6.1**
After adding an EXPENSE transaction with a date in `yearMonth`, `newMonthlyExpenses === oldMonthlyExpenses + amount`.

### Property 7: Expenses in Other Months Excluded
**Validates: Requirements 3.1**
Transactions whose `date` does not start with `yearMonth` do not affect `monthlyExpenses`, regardless of their `type` or `amount`.

---

## Testing Strategy

### Unit Tests (`__tests__/budget/manager.test.ts`)

- No transactions → `monthlyExpenses = 0`
- Expenses in current month are summed correctly
- Expenses in other months are excluded
- INCOME transactions are excluded
- `budget = null` → `status: NO_BUDGET`
- `budget = 0` → `status: NO_BUDGET` (callers normalise ≤ 0 → null via store)
- `monthlyExpenses < budget` → `WITHIN_BUDGET`, correct `remaining`
- `monthlyExpenses === budget` → `WITHIN_BUDGET`, `remaining = 0`
- `monthlyExpenses > budget` → `OVER_BUDGET`, correct `overspend`
- `percentage > 100` scenario
- `loadBudget` — stored value ≤ 0 → returns `null`, logs warning
- `saveBudget` — quota error → returns `{ success: false }`, does not throw
- `computeMonthlyExpenses` — transaction with malformed/missing date → excluded, no error

### Property-Based Tests

See **Correctness Properties** above. Run with `numRuns: 100` minimum.

---

## Design Decisions

1. **Inject `yearMonth`** — keeps `evaluateBudget` a pure function with no `Date` dependency; easy to test for any month.
2. **`BudgetEvaluation` object** — returns all computed values in one call; avoids multiple passes over the transaction list.
3. **Separate `BudgetStore`** — mirrors the pattern in `TransactionStore`; consistent persistence API across features.
4. **`saveBudget` returns `{ success: boolean }`** — matches `saveTransactions` signature; callers check return value rather than catching exceptions.
5. **Progress bar capped at 100% visually** — prevents layout breakage on extreme overspend while still showing the red over-budget state.
6. **`Math.floor` for percentage display** — conservative rounding; avoids showing "100%" when slightly under budget.
