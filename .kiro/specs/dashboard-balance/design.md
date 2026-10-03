# Design Document: Dashboard and Balance Calculation

## Overview

The Dashboard is the home page of the Smart Expense Tracker. It consumes the transaction list and computes three summary values (TotalIncome, TotalExpenses, Balance) via a pure `Balance_Calculator` module. The UI is built with Next.js App Router and Tailwind CSS. All calculations are derived — nothing is stored beyond the transaction list itself.

---

## Architecture

```
app/page.tsx                  ← Dashboard page ('use client')
  ├─ components/dashboard/
  │    ├─ SummaryCard.tsx      ← Generic metric display card
  │    ├─ BalanceSummary.tsx   ← Renders three SummaryCards in a grid
  │    └─ EmptyState.tsx       ← Shown when no transactions exist
  └─ components/budget/
       └─ BudgetWidget.tsx     ← Budget status (see monthly-budget spec)
lib/dashboard/
  └─ calculator.ts            ← Pure balance calculation (no I/O)
lib/utils/
  └─ currency.ts              ← formatCurrency() utility
```

The `calculator.ts` module has zero side effects and no I/O. It receives a `Transaction[]` and returns a `FinancialSummary` object. The dashboard page re-derives the summary on every render whenever `transactions` state changes.

---

## Data Models

```typescript
// lib/dashboard/calculator.ts

import type { Transaction } from '@/lib/transactions/types';

export interface FinancialSummary {
  totalIncome: number;    // sum of INCOME transaction amounts; ≥ 0
  totalExpenses: number;  // sum of EXPENSE transaction amounts; ≥ 0
  balance: number;        // totalIncome - totalExpenses; may be negative
}
```

```typescript
// lib/utils/currency.ts

/**
 * Formats a number as USD currency with exactly 2 decimal places.
 * Negative values use Unicode minus sign U+2212 (−) instead of ASCII hyphen-minus (-).
 * Example: formatCurrency(-123.45) → "−$123.45"
 */
export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  return value < 0 ? `−${formatted}` : formatted;
}
```

The `calculateSummary` function:

```typescript
export function calculateSummary(transactions: Transaction[]): FinancialSummary {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
}
```

An empty list returns `{ totalIncome: 0, totalExpenses: 0, balance: 0 }`.

---

## Components and Interfaces

### `SummaryCard` (`components/dashboard/SummaryCard.tsx`)

```tsx
interface SummaryCardProps {
  label: string;
  value: number;
  variant: 'income' | 'expense' | 'balance';
  isLoading?: boolean;
}
```

- When `isLoading` is `true`: renders a skeleton/pulse placeholder in place of the value.
- `income` variant: always green background/text.
- `expense` variant: always red background/text.
- `balance` variant: green when `value >= 0`, red when `value < 0`.
- Value displayed via `formatCurrency(value)`.

### `BalanceSummary` (`components/dashboard/BalanceSummary.tsx`)

```tsx
interface BalanceSummaryProps {
  summary: FinancialSummary;
  isLoading?: boolean;
}
```

Renders three `SummaryCard` components in a responsive grid (`grid-cols-1 sm:grid-cols-3`). Passes `isLoading` to each card.

### `EmptyState` (`components/dashboard/EmptyState.tsx`)

Rendered when `transactions.length === 0`. Displays a friendly message and a call-to-action button/link navigating to `/transactions` to add the first transaction.

### Dashboard Page (`app/page.tsx`)

`'use client'` component. Owns all state relevant to the dashboard:

```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [summaryError, setSummaryError] = useState<string | null>(null);
const [lastGoodSummary, setLastGoodSummary] = useState<FinancialSummary>(
  { totalIncome: 0, totalExpenses: 0, balance: 0 }
);
```

**On mount** (`useEffect`): calls `loadTransactions()` from `lib/transactions/store.ts`, sets `transactions`, clears `isLoading`.

**On transactions change**: wraps `calculateSummary(transactions)` in a `try/catch`:
- On success: updates `lastGoodSummary`, clears `summaryError`.
- On error: sets `summaryError` to an error message, retains `lastGoodSummary` (displays last known good values).

Passes `isLoading` to `BalanceSummary` while the initial load is pending.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `calculateSummary` throws (unexpected) | `summaryError` is set; `lastGoodSummary` is displayed; error banner shown |
| Next successful recalculation | `summaryError` cleared; fresh values displayed |
| `loadTransactions` fails or returns empty | `transactions = []`; empty state shown; `$0.00` displayed for all three cards |
| `isLoading = true` (initial load pending) | All three `SummaryCard` components show loading skeleton via `isLoading` prop |

---

## Correctness Properties

Implemented as property-based tests in `__tests__/dashboard/calculator.pbt.ts` using **fast-check**:

### Property 1: Balance Identity
**Validates: Requirements 3.1, 3.2**
`balance === totalIncome - totalExpenses` holds for any transaction list, with no floating-point drift beyond 1e-9.

### Property 2: Non-Negative Income
**Validates: Requirements 1.1, 1.2**
`totalIncome >= 0` for any list of valid transactions (all amounts are > 0 by the validator).

### Property 3: Non-Negative Expenses
**Validates: Requirements 2.1, 2.2**
`totalExpenses >= 0` for any list of valid transactions.

### Property 4: Adding INCOME Increases Balance
**Validates: Requirements 3.1, 4.1**
After appending an INCOME transaction of amount `a`, `newBalance === oldBalance + a`.

### Property 5: Adding EXPENSE Decreases Balance
**Validates: Requirements 3.1, 4.2**
After appending an EXPENSE transaction of amount `a`, `newBalance === oldBalance - a`.

### Property 6: Commutativity
**Validates: Requirements 1.1, 2.1, 3.1**
`calculateSummary(transactions)` produces the same result regardless of the order of transactions in the list.

### Property 7: Empty List Identity
**Validates: Requirements 5.1**
`calculateSummary([])` always returns `{ totalIncome: 0, totalExpenses: 0, balance: 0 }`.

---

## Testing Strategy

### Unit Tests (`__tests__/dashboard/calculator.test.ts`)

- Empty list → all zeros
- INCOME-only list → balance = totalIncome, expenses = 0
- EXPENSE-only list → balance = −totalExpenses, income = 0
- Mixed list → balance = income − expenses
- Floating-point amounts (e.g., 10.1 + 20.2 — verify no rounding surprise)
- `formatCurrency` — positive, zero, negative, large number

### Property-Based Tests

See **Correctness Properties** above. Run with `numRuns: 100` minimum.

---

## Design Decisions

1. **Pure `calculateSummary` function** — zero dependencies, trivially testable, no mocking required.
2. **Derived state only** — balance is never stored; computed on every render from the transaction list. Eliminates synchronisation bugs.
3. **`Intl.NumberFormat` with Unicode minus** — locale-aware formatting; Unicode U+2212 for negative values matches the requirements spec exactly.
4. **`isLoading` prop on `SummaryCard`** — skeleton placeholder satisfies Req 3.7 without a separate loading component.
5. **`lastGoodSummary` + `summaryError` pattern** — retains the last valid state on error, preventing jarring UI resets (Req 4.4).
6. **Colour semantics** — red for negative balance/expenses, green for income/positive balance; standard financial UI convention.
