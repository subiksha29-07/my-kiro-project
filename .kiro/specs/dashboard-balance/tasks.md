# Implementation Plan: Dashboard and Balance Calculation

## Overview

Implements the Dashboard home page and its supporting Balance Calculator library. All tasks assume `lib/transactions/types.ts` and `lib/transactions/store.ts` already exist (Transaction Management spec). Tasks proceed from pure library code → tests → UI components → page wiring.

---

## Tasks

- [ ] 1. Implement Balance Calculator library and currency formatter
  - [ ] 1.1 Create `lib/dashboard/calculator.ts`
    - Export `FinancialSummary` interface: `{ totalIncome: number; totalExpenses: number; balance: number }`
    - Export `calculateSummary(transactions: Transaction[]): FinancialSummary` — pure function, no I/O, no React
    - Filter `type === 'INCOME'` and sum `amount` for `totalIncome`; filter `type === 'EXPENSE'` and sum `amount` for `totalExpenses`; set `balance = totalIncome - totalExpenses`
    - An empty list must return `{ totalIncome: 0, totalExpenses: 0, balance: 0 }`
    - Import `Transaction` from `@/lib/transactions/types`
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 5.1_
    - _Acceptance: `calculateSummary([])` returns all zeros; INCOME-only list sets `totalExpenses = 0`; EXPENSE-only list sets `totalIncome = 0`; mixed list produces `balance = totalIncome - totalExpenses`_

  - [ ] 1.2 Create `lib/utils/currency.ts`
    - Export `formatCurrency(value: number): string`
    - Use `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })` on `Math.abs(value)`
    - Prepend Unicode minus sign **U+2212 (`−`)** — NOT ASCII hyphen (`-`) — when `value < 0`
    - Example: `formatCurrency(-123.45)` → `"−$123.45"`; `formatCurrency(0)` → `"$0.00"`
    - _Requirements: 1.4, 2.4, 3.6_
    - _Acceptance: Negative values begin with `\u2212`, not `\u002D`; two decimal places always present; `$` symbol included_

- [ ] 2. Unit tests for `calculateSummary` and `formatCurrency`
  - [ ] 2.1 Create `__tests__/dashboard/calculator.test.ts`
    - `calculateSummary` — empty list → all zeros
    - `calculateSummary` — INCOME-only list → `balance === totalIncome`, `totalExpenses === 0`
    - `calculateSummary` — EXPENSE-only list → `balance === -totalExpenses`, `totalIncome === 0`
    - `calculateSummary` — mixed list → `balance === totalIncome - totalExpenses`
    - `calculateSummary` — floating-point amounts (e.g. `10.1 + 20.2`) → result within 1e-9 of expected
    - `formatCurrency` — positive value → `"$1,234.56"` format
    - `formatCurrency` — zero → `"$0.00"`
    - `formatCurrency` — negative value → starts with `\u2212` (Unicode minus), e.g. `"−$123.45"`
    - `formatCurrency` — large number → thousands separator present
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.4, 3.1, 3.2, 3.6, 5.1_
    - _Acceptance: All unit tests pass with `npm run test`_

- [ ] 3. Property-based tests for `calculateSummary`
  - Create `__tests__/dashboard/calculator.pbt.ts`; import arbitraries from `__tests__/arbitraries.ts`; use `numRuns: 100` minimum

  - [ ]* 3.1 Write property test — Property 1: Balance identity
    - **Property 1: `Math.abs(balance - (totalIncome - totalExpenses)) < 1e-9` for any transaction list**
    - Use `arbitraryTransactionList()` arbitrary
    - **Validates: Requirements 3.1, 3.2**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.2 Write property test — Property 2: Non-negative income
    - **Property 2: `totalIncome >= 0` for any list of valid transactions (all amounts are positive)**
    - Use `arbitraryTransactionList()` arbitrary
    - **Validates: Requirements 1.1, 1.2**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.3 Write property test — Property 3: Non-negative expenses
    - **Property 3: `totalExpenses >= 0` for any list of valid transactions**
    - Use `arbitraryTransactionList()` arbitrary
    - **Validates: Requirements 2.1, 2.2**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.4 Write property test — Property 4: Adding INCOME increases balance
    - **Property 4: Appending one INCOME transaction of amount `a` → `newBalance === oldBalance + a`**
    - Use `arbitraryTransactionList()` and `arbitraryAmount()` arbitraries; set `type: 'INCOME'`
    - **Validates: Requirements 3.1, 4.1**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.5 Write property test — Property 5: Adding EXPENSE decreases balance
    - **Property 5: Appending one EXPENSE transaction of amount `a` → `newBalance === oldBalance - a`**
    - Use `arbitraryTransactionList()` and `arbitraryAmount()` arbitraries; set `type: 'EXPENSE'`
    - **Validates: Requirements 3.1, 4.2**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.6 Write property test — Property 6: Commutativity
    - **Property 6: Shuffling the transaction list does not change `totalIncome`, `totalExpenses`, or `balance`**
    - Use `arbitraryTransactionList()` and `fc.shuffledSubarray` or `fc.array` with Fisher-Yates shuffle
    - **Validates: Requirements 1.1, 2.1, 3.1**
    - _Acceptance: Property passes 100 runs without counterexample_

  - [ ]* 3.7 Write property test — Property 7: Empty list identity
    - **Property 7: `calculateSummary([])` always returns `{ totalIncome: 0, totalExpenses: 0, balance: 0 }`**
    - This is a deterministic property; wrap in `fc.property(fc.constant([]), ...)`
    - **Validates: Requirements 5.1**
    - _Acceptance: Property passes 100 runs without counterexample_

- [ ] 4. Checkpoint — verify library is correct before building UI
  - Ensure all tests pass (`npm run test`), ask the user if questions arise.

- [ ] 5. Implement `SummaryCard` component
  - [ ] 5.1 Create `components/dashboard/SummaryCard.tsx`
    - Props: `label: string`, `value: number`, `variant: 'income' | 'expense' | 'balance'`, `isLoading?: boolean`
    - When `isLoading === true`: render a skeleton/pulse placeholder element in place of the value (do NOT render the numeric value)
    - `income` variant: always green colour scheme
    - `expense` variant: always red colour scheme
    - `balance` variant: green when `value >= 0`, red when `value < 0` (two visually distinct states)
    - Display value via `formatCurrency(value)` from `@/lib/utils/currency`
    - _Requirements: 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 3.5, 3.6, 3.7_
    - _Acceptance: All three variants render their labels; balance card is red for negative value and green for zero/positive; `isLoading=true` shows skeleton, not the value; currency string matches `formatCurrency` output_

- [ ] 6. Implement `BalanceSummary` component
  - [ ] 6.1 Create `components/dashboard/BalanceSummary.tsx`
    - Props: `summary: FinancialSummary`, `isLoading?: boolean`
    - Render three `SummaryCard` components in a responsive grid: `grid-cols-1 sm:grid-cols-3`
      - "Total Income" → `variant="income"`, `value={summary.totalIncome}`
      - "Total Expenses" → `variant="expense"`, `value={summary.totalExpenses}`
      - "Current Balance" → `variant="balance"`, `value={summary.balance}`
    - Pass `isLoading` down to each `SummaryCard`
    - _Requirements: 1.3, 2.3, 3.3, 3.7_
    - _Acceptance: Renders exactly three cards with correct labels and variants; single-column on narrow screens, three-column on `sm` and above; all cards show skeleton when `isLoading=true`_

- [ ] 7. Implement `EmptyState` component
  - [ ] 7.1 Create `components/dashboard/EmptyState.tsx`
    - Renders a friendly heading and descriptive message (e.g. "No transactions yet")
    - Renders a visible call-to-action link or button navigating to `/transactions`
    - The CTA must be keyboard-accessible (use `<Link href="/transactions">` or `<button>` with an `onClick` router push)
    - _Requirements: 5.2_
    - _Acceptance: Component renders a non-empty CTA text; clicking/activating the CTA navigates to `/transactions`; the message and link are both visible in the DOM_

- [ ] 8. Implement Dashboard page and wire everything together
  - [ ] 8.1 Create/replace `app/page.tsx` as a `'use client'` page
    - Declare four state variables:
      - `transactions: Transaction[]` — starts as `[]`
      - `isLoading: boolean` — starts as `true`
      - `summaryError: string | null` — starts as `null`
      - `lastGoodSummary: FinancialSummary` — starts as `{ totalIncome: 0, totalExpenses: 0, balance: 0 }`
    - On mount (`useEffect` with `[]` deps): call `loadTransactions()` from `@/lib/transactions/store`, set `transactions`, set `isLoading = false`
    - In a second `useEffect` watching `transactions`: wrap `calculateSummary(transactions)` in `try/catch`
      - On success: update `lastGoodSummary`, clear `summaryError`
      - On error: set `summaryError` to an error message string, **retain** `lastGoodSummary` (do not reset to zeros)
    - Render `<BalanceSummary summary={lastGoodSummary} isLoading={isLoading} />`
    - Conditionally render `<EmptyState />` when `transactions.length === 0 && !isLoading`
    - Conditionally render an error banner (e.g. `<p role="alert">`) when `summaryError !== null`
    - _Requirements: 1.3, 2.3, 3.3, 3.7, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2_
    - _Acceptance: On first load `isLoading=true` → all three cards show skeletons; after load with empty list → `$0.00` in all cards and `EmptyState` visible; after load with transactions → correct totals; if `calculateSummary` throws → error banner shown and last good values retained_

- [ ] 9. Final checkpoint — full integration pass
  - Ensure all tests pass (`npm run test`), ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP, but all 7 properties should pass before declaring the calculator complete.
- Each task references specific acceptance criteria for traceability.
- `calculateSummary` is a pure function — never call `localStorage` or any async API inside it.
- `formatCurrency` must use Unicode minus `\u2212` for negatives (Req 3.6); verify with `charCodeAt(0) === 0x2212`.
- The `lastGoodSummary` default of all-zeros satisfies the empty-state display requirement (Req 5.1) without special-casing.
- Depends on: `lib/transactions/types.ts` (exports `Transaction`, `TransactionType`) and `lib/transactions/store.ts` (exports `loadTransactions()`).

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["6.1", "7.1"] },
    { "id": 5, "tasks": ["8.1"] }
  ]
}
```
