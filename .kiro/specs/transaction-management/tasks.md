# Implementation Plan: Transaction Management

## Overview

Implement the full Transaction Management feature for the Smart Expense Tracker: shared types, validation, persistence, business logic, property-based tests, UI components, and the transactions page — in strict bottom-up order so every layer is tested before the layer above it depends on it.

Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Vitest + fast-check.

---

## Tasks

- [ ] 1. Project foundations — tooling and configuration
  - [ ] 1.1 Scaffold Next.js 14 app with TypeScript and Tailwind CSS
    - Run `npx create-next-app@14 smart-expense-tracker --typescript --tailwind --app --no-src-dir --import-alias "@/*"` (or verify the project already exists).
    - Confirm `app/layout.tsx`, `app/page.tsx`, and `tailwind.config.ts` are present.
    - Files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`
    - _Requirements: 2.3, 2.4 (UI renders transactions; app loads on startup)_
    - Acceptance: `npx tsc --noEmit` exits 0; Tailwind classes resolve.

  - [ ] 1.2 Install and configure Vitest with jsdom and fast-check
    - Install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom fast-check`.
    - Create `vitest.config.ts` with jsdom environment, globals, and `@` alias pointing to project root.
    - Create `vitest.setup.ts` that imports `@testing-library/jest-dom`.
    - Add `"test": "vitest --run"` and `"test:watch": "vitest"` and `"test:coverage": "vitest --coverage"` to `package.json` scripts.
    - Files: `vitest.config.ts`, `vitest.setup.ts`, `package.json`
    - _Requirements: (test infrastructure — supports all requirements)_
    - Acceptance: `npm run test` exits 0 with no test files (or a trivial passing smoke test).

  - [ ] 1.3 Create shared test arbitraries file
    - Create `__tests__/arbitraries.ts` with all arbitraries from the shared reference: `arbitraryTransactionType`, `arbitraryAmount`, `arbitraryInvalidAmount`, `arbitraryCategory`, `arbitraryDate`, `arbitraryTransactionInput`, `arbitraryIncomeInput`, `arbitraryExpenseInput`, `arbitraryTransaction`, `arbitraryTransactionList`, `arbitraryNonEmptyTransactionList`.
    - File: `__tests__/arbitraries.ts`
    - _Requirements: (test infrastructure — supports properties 1–8)_
    - Acceptance: TypeScript compiles; arbitraries can be imported without error.

- [ ] 2. Shared types and constants
  - [ ] 2.1 Create `lib/transactions/types.ts`
    - Define and export: `TransactionType`, `Transaction`, `TransactionInput`, `ValidationError`, `ValidationResult`, `FilterOptions`, `ManagerResult<T>`.
    - `ManagerResult<T>` must be the discriminated union: `{ ok: true; data: T } | { ok: false; error: 'NOT_FOUND' | 'STALE_UPDATE' | 'STORE_ERROR' }`.
    - File: `lib/transactions/types.ts`
    - _Requirements: 1.2–1.8 (validation types), 3.4, 3.6, 4.2 (manager result errors)_
    - Acceptance: `npx tsc --noEmit` exits 0; all types importable.

  - [ ] 2.2 Create `lib/transactions/constants.ts`
    - Export `INCOME_CATEGORIES: readonly string[]` = `['Salary','Freelance','Investment','Gift','Other Income']`.
    - Export `EXPENSE_CATEGORIES: readonly string[]` = `['Food','Transport','Housing','Healthcare','Entertainment','Education','Shopping','Other Expense']`.
    - Export `STORAGE_KEY = 'smart-expense-tracker-transactions'` (re-exported here for convenience; `store.ts` may import it directly).
    - File: `lib/transactions/constants.ts`
    - _Requirements: 2.3 (UI shows category), 5.1–5.3 (filter by category), 6.1–6.2 (storage key)_
    - Acceptance: Both arrays are non-empty; `STORAGE_KEY` matches the project architecture spec.

- [ ] 3. Currency utility
  - [ ] 3.1 Create `lib/utils/currency.ts`
    - Implement `export function formatCurrency(amount: number): string` using `Intl.NumberFormat` with style `'currency'` and currency `'USD'` (or the locale default for demo purposes).
    - The function must format to exactly 2 decimal places.
    - File: `lib/utils/currency.ts`
    - _Requirements: 2.3 (amounts displayed with currency symbol and two decimal places)_
    - Acceptance: `formatCurrency(1234.5)` returns a string containing `'1,234.50'`; `formatCurrency(0)` returns a string containing `'0.00'`.

  - [ ]* 3.2 Write unit tests for `formatCurrency`
    - Test: positive integer, positive decimal, zero, large value (999999999.99).
    - File: `__tests__/utils/currency.test.ts`
    - _Requirements: 2.3_
    - Acceptance: All tests pass with `npm run test`.

- [ ] 4. Validation layer
  - [ ] 4.1 Implement `lib/transactions/validator.ts`
    - Implement `export function validateTransaction(input: TransactionInput): ValidationResult`.
    - Apply all six field rules exactly as specified:
      - `title`: non-empty, max 100 chars.
      - `amount`: finite number > 0, ≤ 999,999,999.99, at most 2 decimal places (use `Math.round(amount * 100) / 100 === amount` or equivalent).
      - `type`: exactly `'INCOME'` or `'EXPENSE'`.
      - `category`: non-empty, max 100 chars.
      - `date`: matches `/^\d{4}-\d{2}-\d{2}$/`, is a valid calendar date, within `1900-01-01`–`2100-12-31`.
      - `description`: if present, max 500 chars.
    - Collect ALL failing fields before returning — never short-circuit after the first error.
    - Return `{ valid: true, errors: [] }` when all fields pass.
    - File: `lib/transactions/validator.ts`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.3_
    - Acceptance: `npx tsc --noEmit` exits 0; function is a pure function with no side effects.

  - [ ]* 4.2 Write unit tests for `validateTransaction`
    - One `describe` per field.
    - Cover: empty string, max-length boundary (100 chars valid, 101 chars invalid), amount = 0 (invalid), amount = 0.001 (invalid — >2 dp), amount = 999999999.99 (valid), amount = 1000000000 (invalid), invalid type string, date out of range (1899-12-31, 2101-01-01), invalid calendar date (2023-02-30), description = 500 chars (valid), description = 501 chars (invalid).
    - Verify multi-field failure returns errors for ALL failing fields simultaneously.
    - File: `__tests__/transactions/validator.test.ts`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
    - Acceptance: All tests pass; coverage on `validator.ts` > 90%.

- [ ] 5. Persistence layer
  - [ ] 5.1 Implement `lib/transactions/store.ts`
    - Implement `export function loadTransactions(): Transaction[]`.
      - Read `localStorage.getItem(STORAGE_KEY)`.
      - If key is absent: return `[]` and call `console.warn`.
      - If JSON parse throws: return `[]` and call `console.warn`.
      - If parsed value is not an array: return `[]` and call `console.warn`.
      - Otherwise return the parsed array cast as `Transaction[]`.
    - Implement `export function saveTransactions(transactions: Transaction[]): { success: boolean }`.
      - Serialize to JSON and call `localStorage.setItem`.
      - Catch `QuotaExceededError` (check `error.name === 'QuotaExceededError'` or `error instanceof DOMException`): return `{ success: false }` without throwing.
      - On success return `{ success: true }`.
    - File: `lib/transactions/store.ts`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
    - Acceptance: `npx tsc --noEmit` exits 0; no React or UI imports.

  - [ ]* 5.2 Write unit tests for `lib/transactions/store.ts`
    - Use the `localStorageMock` pattern from testing conventions (`vi.stubGlobal`).
    - Tests:
      - `loadTransactions` — missing key returns `[]` + warns.
      - `loadTransactions` — malformed JSON returns `[]` + warns.
      - `loadTransactions` — valid JSON object (not array) returns `[]` + warns.
      - `loadTransactions` — valid array round-trips correctly.
      - `saveTransactions` — successful write returns `{ success: true }`.
      - `saveTransactions` — `QuotaExceededError` returns `{ success: false }`.
    - File: `__tests__/transactions/store.test.ts`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
    - Acceptance: All tests pass; `console.warn` is asserted via `vi.spyOn`.

- [ ] 6. Business logic layer
  - [ ] 6.1 Implement `lib/transactions/manager.ts` — `addTransaction`
    - Implement `export function addTransaction(store, input)`.
    - Call `validateTransaction(input)`; if `!result.valid`, throw an Error (caller is responsible for pre-validating — the form calls `validateTransaction` before calling `addTransaction`).
    - Assign `id = crypto.randomUUID()`, `createdAt = new Date().toISOString()`, `updatedAt = createdAt`.
    - Return `{ store: [...store, newTransaction], transaction: newTransaction }`.
    - File: `lib/transactions/manager.ts`
    - _Requirements: 1.1, 1.9_
    - Acceptance: Returns a new array (does not mutate `store`); new transaction has a UUID id.

  - [ ] 6.2 Implement `lib/transactions/manager.ts` — `getTransactions`
    - Implement `export function getTransactions(store, filters?)`.
    - Apply optional `FilterOptions` (type, category, or both) — filter without mutating `store`.
    - Sort result: primary key `date` descending, tie-break `createdAt` descending.
    - Return `[]` when filters match nothing.
    - File: `lib/transactions/manager.ts`
    - _Requirements: 2.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
    - Acceptance: Pure function — does not mutate input; sort order verifiable by unit test.

  - [ ] 6.3 Implement `lib/transactions/manager.ts` — `updateTransaction`
    - Implement `export function updateTransaction(store, id, input, expectedUpdatedAt): ManagerResult<...>`.
    - If no transaction with `id` found: return `{ ok: false, error: 'NOT_FOUND' }`.
    - If found transaction's `updatedAt !== expectedUpdatedAt`: return `{ ok: false, error: 'STALE_UPDATE' }`.
    - On success: set `updatedAt = new Date().toISOString()`, preserve `id` and `createdAt`, return `{ ok: true, data: { store, transaction } }`.
    - File: `lib/transactions/manager.ts`
    - _Requirements: 3.2, 3.4, 3.6_
    - Acceptance: Original `id` unchanged in returned transaction; stale-update guard works.

  - [ ] 6.4 Implement `lib/transactions/manager.ts` — `deleteTransaction`
    - Implement `export function deleteTransaction(store, id): ManagerResult<{ store }>`.
    - If no transaction with `id` found: return `{ ok: false, error: 'NOT_FOUND' }`.
    - On success: return `{ ok: true, data: { store: store.filter(t => t.id !== id) } }`.
    - File: `lib/transactions/manager.ts`
    - _Requirements: 4.1, 4.2_
    - Acceptance: Returned store length is `store.length - 1`; `NOT_FOUND` returned for missing id.

  - [ ]* 6.5 Write unit tests for `lib/transactions/manager.ts`
    - Cover `addTransaction`: new transaction has correct fields, store grows by 1, does not mutate input array.
    - Cover `getTransactions`: sort by date desc, tie-break by createdAt desc, filter by type, filter by category, filter by both, clear filters, filter returns `[]` for no-match.
    - Cover `updateTransaction`: success path, `NOT_FOUND`, `STALE_UPDATE`.
    - Cover `deleteTransaction`: success path, `NOT_FOUND`.
    - File: `__tests__/transactions/manager.test.ts`
    - _Requirements: 1.1, 1.9, 2.1, 3.2, 3.4, 3.6, 4.1, 4.2, 5.1–5.6_
    - Acceptance: All tests pass; no test mutates a shared store variable across tests.

- [ ] 7. Property-based tests for Transaction Manager
  - [ ]* 7.1 Write PBT — Property 1: Balance Invariant
    - Use `arbitraryTransactionList()` + `calculateSummary` (from `lib/dashboard/calculator.ts` — stub if not yet implemented: `totalIncome = sum of INCOME amounts`, `totalExpenses = sum of EXPENSE amounts`, `balance = totalIncome - totalExpenses`).
    - Assert: `|balance - (totalIncome - totalExpenses)| < 1e-9` for all generated lists.
    - **Property 1: Balance Invariant**
    - **Validates: Requirements 1.1, 2.1**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.2 Write PBT — Property 2: Amount Non-Negative
    - Use `arbitraryTransactionInput()` (which always generates valid positive amounts).
    - Assert: `validateTransaction(input).valid === true` for every generated input — the validator never rejects a structurally valid positive amount.
    - **Property 2: Amount Non-Negative**
    - **Validates: Requirements 1.3**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.3 Write PBT — Property 3: Filter Subset
    - Use `arbitraryTransactionList()` and `fc.record({ type: fc.option(...), category: fc.option(...) })` for filters.
    - Assert: every transaction returned by `getTransactions(store, filter)` has its id present in `store`.
    - **Property 3: Filter Subset**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.4 Write PBT — Property 4: Add Increases Total Expenses
    - Use `arbitraryTransactionList()` and `arbitraryExpenseInput()`.
    - Compute old expense sum; call `addTransaction`; compute new expense sum.
    - Assert: `newExpenseSum === oldExpenseSum + input.amount` (within floating-point tolerance 1e-9).
    - **Property 4: Add Increases Total Expenses**
    - **Validates: Requirements 1.1, 1.9**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.5 Write PBT — Property 5: Delete Decreases Count
    - Use `arbitraryNonEmptyTransactionList()`.
    - Pick a random index (`fc.integer`), delete that transaction by id.
    - Assert: `result.ok === true` and `result.data.store.length === store.length - 1`.
    - **Property 5: Delete Decreases Count**
    - **Validates: Requirements 4.1, 4.3**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.6 Write PBT — Property 6: Sort Stability
    - Use `arbitraryTransactionList()`.
    - Call `getTransactions(store)`.
    - Assert: for every adjacent pair `[a, b]` in the result, `a.date >= b.date`; when `a.date === b.date`, `a.createdAt >= b.createdAt`.
    - **Property 6: Sort Stability**
    - **Validates: Requirements 2.1**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.7 Write PBT — Property 7: Round-Trip Persistence
    - Use `arbitraryTransactionList()`.
    - Stub `localStorage` with the mock from testing conventions.
    - Call `saveTransactions(list)` then `loadTransactions()`.
    - Assert: returned list is deeply equal to `list` (same ids, same field values).
    - **Property 7: Round-Trip Persistence**
    - **Validates: Requirements 6.1, 6.2**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

  - [ ]* 7.8 Write PBT — Property 8: Edit Preserves ID
    - Use `arbitraryNonEmptyTransactionList()` and `arbitraryTransactionInput()`.
    - Pick a random transaction; call `updateTransaction(store, t.id, input, t.updatedAt)`.
    - Assert: `result.ok === true` and `result.data.transaction.id === t.id`.
    - **Property 8: Edit Preserves ID**
    - **Validates: Requirements 3.2**
    - File: `__tests__/transactions/manager.pbt.ts`
    - Acceptance: `fc.assert` passes with `numRuns: 100`.

- [ ] 8. Checkpoint — all lib tests pass
  - Run `npm run test`. Ensure all tests in `__tests__/transactions/` pass (validator, manager, store, manager.pbt). Ask the user if questions arise before proceeding to UI.

- [ ] 9. UI components
  - [ ] 9.1 Implement `components/transactions/TransactionItem.tsx`
    - `'use client'` component.
    - Props: `transaction: Transaction`, `onEdit: (t: Transaction) => void`, `onDelete: (id: string) => void`.
    - Display: title, formatted amount (`formatCurrency`) prefixed with `"+"` for INCOME and `"−"` for EXPENSE, type badge, category, date formatted as `Month DD, YYYY` (use `Intl.DateTimeFormat` or `toLocaleDateString`).
    - Render Edit and Delete buttons that call `onEdit(transaction)` and `onDelete(transaction.id)` respectively.
    - Files: `components/transactions/TransactionItem.tsx`
    - _Requirements: 2.3, 3.1, 4.4_
    - Acceptance: Amount sign prefix correct for both types; date shows human-readable format.

  - [ ] 9.2 Implement `components/transactions/DeleteConfirmDialog.tsx`
    - `'use client'` component.
    - Props: `isOpen: boolean`, `onConfirm: () => void`, `onCancel: () => void`.
    - When `isOpen` is true, render a modal/dialog with a "Confirm" button and a "Cancel" button.
    - When `isOpen` is false, render nothing (return `null`).
    - Files: `components/transactions/DeleteConfirmDialog.tsx`
    - _Requirements: 4.4, 4.5_
    - Acceptance: Both buttons are visible when open; Cancel does not trigger `onConfirm`.

  - [ ] 9.3 Implement `components/transactions/TransactionFilter.tsx`
    - `'use client'` component.
    - Props: `filters: FilterOptions`, `categories: string[]`, `onChange: (filters: FilterOptions) => void`.
    - Render a type selector (`INCOME` / `EXPENSE` / All) and a category selector populated from `categories`.
    - Render a "Clear Filters" button that calls `onChange({})`.
    - Files: `components/transactions/TransactionFilter.tsx`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
    - Acceptance: Selecting a type or category calls `onChange` with correct `FilterOptions`; Clear Filters calls `onChange({})`.

  - [ ] 9.4 Implement `components/transactions/TransactionForm.tsx`
    - `'use client'` component.
    - Props:
      ```tsx
      interface TransactionFormProps {
        initialValues?: TransactionInput & { updatedAt?: string };
        onSubmit: (input: TransactionInput, expectedUpdatedAt?: string) => void;
        onCancel?: () => void;
      }
      ```
    - Render controlled inputs for all six fields. Populate dropdowns for type and category from constants.
    - On submit: call `validateTransaction`; if invalid, display per-field inline error messages and do NOT call `onSubmit`.
    - If valid: call `onSubmit(input, initialValues?.updatedAt)`.
    - On successful add (no `initialValues`): show a success notification for ≥ 3 seconds, then reset all fields to empty/default state.
    - On store failure (parent signals via a prop or via returned promise rejection — coordinate with page design): retain form values and show an error message.
    - Render a Cancel button that calls `onCancel?.()` when present.
    - Files: `components/transactions/TransactionForm.tsx`
    - _Requirements: 1.2–1.11, 3.1, 3.3_
    - Acceptance: Inline validation messages appear for each invalid field; success notification lasts ≥ 3 s; form resets after successful add.

  - [ ] 9.5 Implement `components/transactions/TransactionList.tsx`
    - `'use client'` component.
    - Props: `transactions: Transaction[]`, `onEdit: (t: Transaction) => void`, `onDelete: (id: string) => void`.
    - If `transactions.length === 0` and no active filters: render an empty-state message ("No transactions recorded yet.").
    - If `transactions.length === 0` with active filters: render "No transactions match the selected filter."
    - Otherwise: render a `TransactionItem` for each transaction.
    - Accept an optional `isFiltered?: boolean` prop to distinguish the two empty states.
    - Files: `components/transactions/TransactionList.tsx`
    - _Requirements: 2.2, 2.3, 5.6_
    - Acceptance: Correct empty-state message shown for each scenario; list renders in the order it receives transactions (sorting done by manager).

- [ ] 10. Transactions page — full CRUD wiring
  - [ ] 10.1 Implement `app/transactions/page.tsx`
    - `'use client'` page component.
    - Declare state:
      ```typescript
      const [transactions, setTransactions] = useState<Transaction[]>([]);
      const [filters, setFilters] = useState<FilterOptions>({});
      const [editTarget, setEditTarget] = useState<Transaction | null>(null);
      const [loadError, setLoadError] = useState<string | null>(null);
      ```
    - On mount (`useEffect`): call `loadTransactions()`; if result is an empty array and a warning was logged (use a wrapper or check localStorage directly), set `loadError`. Set `transactions` from loaded data.
    - Compute `displayedTransactions = getTransactions(transactions, filters)` (derived, not stored in state).
    - Add handler: call `validateTransaction`; if valid, call `addTransaction` → `saveTransactions(newStore)`. If `saveTransactions` returns `{ success: false }`: show error, do NOT update state. If success: `setTransactions(newStore)`.
    - Edit handler: call `updateTransaction` with `expectedUpdatedAt`; handle `NOT_FOUND` (show error), `STALE_UPDATE` (show error + reload), `STORE_ERROR` (show error). On success: `setTransactions(newStore)`, `setEditTarget(null)`.
    - Delete handler: show `DeleteConfirmDialog`. On confirm: call `deleteTransaction` → `saveTransactions`. Handle `NOT_FOUND` and store failure. On success: `setTransactions(newStore)`.
    - Render: `TransactionFilter`, `TransactionForm` (with `initialValues={editTarget ?? undefined}`), `TransactionList`, `DeleteConfirmDialog`.
    - Files: `app/transactions/page.tsx`
    - _Requirements: 1.1, 1.10, 1.11, 2.2–2.5, 3.1–3.6, 4.1–4.5, 5.1–5.6, 6.1–6.5_
    - Acceptance: Full add/edit/delete cycle works end-to-end; page reload preserves transactions; filter clears correctly.

- [ ] 11. Final checkpoint — full test suite passes
  - Run `npm run test`. All tests across validator, manager, store, PBT, and utility files must pass. Ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP. Core lib tests (4.2, 5.2, 6.5) are strongly recommended to catch regressions early.
- Each task references specific requirements for traceability.
- The business logic layer (tasks 6–7) must be complete before UI components (tasks 9–10) are started — components depend on the lib types and functions.
- Property-based tests in task 7 all live in a single file (`manager.pbt.ts`) but are broken into one sub-task per property to allow independent execution.
- `calculateSummary` (used in Property 1) belongs to the Dashboard feature. Task 7.1 should stub it inline if that feature is not yet implemented.
- No authentication, backend API, deployment, or payment features are in scope for this spec.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 3, "tasks": ["3.2", "4.2", "5.2", "6.1"] },
    { "id": 4, "tasks": ["6.2", "6.3", "6.4"] },
    { "id": 5, "tasks": ["6.5"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5"] },
    { "id": 8, "tasks": ["10.1"] }
  ]
}
```
