# Design Document: Transaction Management

## Overview

This document describes the technical design for the Transaction Management feature of the Smart Expense Tracker. It covers the data model, layer architecture, API contracts, component structure, and testing strategy. The implementation targets Next.js 14 (App Router), TypeScript, and Tailwind CSS, with `localStorage` as the persistence mechanism for the 2-day demo scope.

---

## Architecture

The feature follows a clean four-layer architecture:

```
UI Layer          → React Client Components (app/transactions/page.tsx, components/transactions/*)
Business Layer    → Transaction Manager   (lib/transactions/manager.ts)
Persistence Layer → Transaction Store     (lib/transactions/store.ts)
Validation Layer  → Transaction Validator (lib/transactions/validator.ts)
Shared Types      → lib/transactions/types.ts
```

Dependency direction: `app/*` → `components/*` → `lib/*`. Nothing inside `lib/` imports from React or browser APIs except `store.ts`, which is the sole owner of `localStorage` access.

---

## Data Models

```typescript
// lib/transactions/types.ts

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;               // UUID v4 — assigned on creation
  title: string;            // 1–100 characters
  amount: number;           // > 0, ≤ 999,999,999.99, ≤ 2 decimal places
  type: TransactionType;
  category: string;         // 1–100 characters
  date: string;             // ISO 8601: YYYY-MM-DD, range 1900-01-01 – 2100-12-31
  description?: string;     // optional, max 500 characters
  createdAt: string;        // ISO 8601 timestamp — set on creation, immutable
  updatedAt: string;        // ISO 8601 timestamp — updated on every edit
}

export interface TransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface FilterOptions {
  type?: TransactionType;
  category?: string;
}

export type ManagerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: 'NOT_FOUND' | 'STALE_UPDATE' | 'STORE_ERROR' };
```

### Predefined Categories

Exported from `lib/transactions/constants.ts` and used as the fixed option set in the UI:

```
INCOME_CATEGORIES:  Salary, Freelance, Investment, Gift, Other Income
EXPENSE_CATEGORIES: Food, Transport, Housing, Healthcare, Entertainment,
                    Education, Shopping, Other Expense
```

---

## Components and Interfaces

### Validation Layer (`lib/transactions/validator.ts`)

Pure functions with no side effects.

```typescript
export function validateTransaction(input: TransactionInput): ValidationResult
```

**Field rules:**
| Field | Rule |
|---|---|
| `title` | Non-empty string, max 100 chars |
| `amount` | Finite number > 0, ≤ 999,999,999.99, at most 2 decimal places |
| `type` | Exactly `'INCOME'` or `'EXPENSE'` |
| `category` | Non-empty string, max 100 chars |
| `date` | Matches `/^\d{4}-\d{2}-\d{2}$/`, valid calendar date, within 1900-01-01–2100-12-31 |
| `description` | If present, max 500 chars |

All failing fields are collected and returned together — never one at a time.

### Persistence Layer (`lib/transactions/store.ts`)

Encapsulates `localStorage` access. All methods are synchronous.

```typescript
const STORAGE_KEY = 'smart-expense-tracker-transactions';

export function loadTransactions(): Transaction[]
export function saveTransactions(transactions: Transaction[]): { success: boolean }
```

- `loadTransactions`: reads key → parses JSON → validates array shape → returns list. Returns `[]` and logs `console.warn` on missing key, parse error, or valid-JSON-but-not-an-array.
- `saveTransactions`: serialises to JSON string → writes to `localStorage`. On `QuotaExceededError`, returns `{ success: false }` without modifying in-memory state and without throwing. Returns `{ success: true }` on success.

### Business Logic Layer (`lib/transactions/manager.ts`)

Stateless pure functions. All receive the current store array and return a new array (no mutation).

```typescript
export function getTransactions(
  store: Transaction[],
  filters?: FilterOptions
): Transaction[]

export function addTransaction(
  store: Transaction[],
  input: TransactionInput
): { store: Transaction[]; transaction: Transaction }

export function updateTransaction(
  store: Transaction[],
  id: string,
  input: TransactionInput,
  expectedUpdatedAt: string
): ManagerResult<{ store: Transaction[]; transaction: Transaction }>

export function deleteTransaction(
  store: Transaction[],
  id: string
): ManagerResult<{ store: Transaction[] }>
```

**`getTransactions` behaviour:**
- Sorts by `date` descending (primary); same-date transactions sorted by `createdAt` descending (tie-breaker).
- Applies `FilterOptions` when provided (type, category, or both).
- When filters match zero transactions, returns `[]` — UI responsibility to show "no results" message.

**`updateTransaction` behaviour:**
- Returns `{ ok: false, error: 'NOT_FOUND' }` if `id` does not match any stored transaction.
- Returns `{ ok: false, error: 'STALE_UPDATE' }` if stored `updatedAt` ≠ `expectedUpdatedAt` (concurrent modification guard).
- On success: sets `updatedAt` to `new Date().toISOString()`, returns `{ ok: true, data: { store, transaction } }`.

**`deleteTransaction` behaviour:**
- Returns `{ ok: false, error: 'NOT_FOUND' }` if `id` does not match any stored transaction.
- On success: returns `{ ok: true, data: { store } }` with the transaction removed.

### UI Components

| Component | Path | Purpose |
|---|---|---|
| `TransactionForm` | `components/transactions/TransactionForm.tsx` | Add / edit form with per-field validation |
| `TransactionList` | `components/transactions/TransactionList.tsx` | Renders the sorted, filtered list |
| `TransactionItem` | `components/transactions/TransactionItem.tsx` | Single row/card with type badge and formatted amount |
| `TransactionFilter` | `components/transactions/TransactionFilter.tsx` | Type + category selectors with "Clear Filters" |
| `DeleteConfirmDialog` | `components/transactions/DeleteConfirmDialog.tsx` | Confirmation modal (Confirm / Cancel) |

All components are `'use client'`. State is owned by the page component; components receive data and callbacks as props.

**`TransactionForm` props:**
```tsx
interface TransactionFormProps {
  initialValues?: TransactionInput & { updatedAt?: string };
  onSubmit: (input: TransactionInput, expectedUpdatedAt?: string) => void;
  onCancel?: () => void;
}
```

**Form feedback behaviour:**
- On successful add: show success notification for ≥ 3 seconds, then reset all fields to empty/default.
- On store failure (`saveTransactions` returns `{ success: false }`): show error message, retain form values — do not reset.

### Page Component (`app/transactions/page.tsx`)

`'use client'` page. Owns all state:

```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [filters, setFilters] = useState<FilterOptions>({});
const [editTarget, setEditTarget] = useState<Transaction | null>(null);
const [loadError, setLoadError] = useState<string | null>(null);
```

On mount (`useEffect`): calls `loadTransactions()`, sets state. If load fails or returns an error indicator, sets `loadError`.

On every mutation: calls the appropriate manager function, then calls `saveTransactions(newStore)`. If `saveTransactions` returns `{ success: false }`, shows an error and does not update state.

---

## Error Handling

| Scenario | Layer | Behaviour |
|---|---|---|
| Invalid form field(s) | Validator | Returns `ValidationResult` with `valid: false` and per-field errors; UI renders inline messages |
| Store quota exceeded on save | Store | `saveTransactions` returns `{ success: false }`; page shows error toast; form values retained |
| Store load failure on startup | Store | `loadTransactions` returns `[]` and logs warning; page sets `loadError` and shows retry prompt |
| Valid JSON but not an array in storage | Store | Treated as malformed; returns `[]`, logs warning |
| Transaction not found on update/delete | Manager | Returns `{ ok: false, error: 'NOT_FOUND' }`; UI shows error message |
| Stale update (concurrent modification) | Manager | Returns `{ ok: false, error: 'STALE_UPDATE' }`; UI shows error, reloads current data |
| Filter returns no results | Manager | Returns `[]`; UI shows "no transactions match" message |

---

## Correctness Properties

These properties are implemented as property-based tests in `__tests__/transactions/manager.pbt.ts` using **fast-check**:

### Property 1: Balance Invariant
**Validates: Requirements 1.1, 2.1**
For any transaction list, `Σ INCOME amounts − Σ EXPENSE amounts === balance` (computed via `calculateSummary`).

### Property 2: Amount Non-Negative
**Validates: Requirements 1.3**
Any generated amount > 0 passes `validateTransaction` — the validator never rejects a structurally valid positive amount.

### Property 3: Filter Subset
**Validates: Requirements 5.1, 5.2, 5.3, 5.5**
`getTransactions(store, filter)` returns only transactions that exist in `store` — filtering never introduces new records.

### Property 4: Add Increases Total Expenses
**Validates: Requirements 1.1, 1.9**
After `addTransaction(store, expenseInput)`, the new total EXPENSE sum equals the old total plus `expenseInput.amount`.

### Property 5: Delete Decreases Count
**Validates: Requirements 4.1, 4.3**
After `deleteTransaction(store, id)` succeeds, `result.store.length === store.length - 1`.

### Property 6: Sort Stability
**Validates: Requirements 2.1**
The list returned by `getTransactions` is always sorted by `date` descending, with same-date transactions sorted by `createdAt` descending.

### Property 7: Round-Trip Persistence
**Validates: Requirements 6.1, 6.2**
`loadTransactions()` called after `saveTransactions(list)` returns a list whose transactions are deeply equal to `list`.

### Property 8: Edit Preserves ID
**Validates: Requirements 3.2**
After `updateTransaction(store, id, input, expectedUpdatedAt)` succeeds, the returned transaction retains the original `id` value unchanged.

---

## Testing Strategy

### Unit Tests (`__tests__/transactions/`)

- `validator.test.ts` — each field's valid/invalid boundary, multi-field failure, exact error messages
- `manager.test.ts` — CRUD correctness, `NOT_FOUND` and `STALE_UPDATE` paths, filter by type/category/both, sort order with tie-breaking
- `store.test.ts` — save/load round-trip, missing key, malformed JSON, valid-JSON-non-array, `QuotaExceededError`

### Property-Based Tests

See **Correctness Properties** above. Implemented in `__tests__/transactions/manager.pbt.ts` with `numRuns: 100`.

### Integration / Smoke Tests

Covered by manual testing with `npm run dev`. Not in scope for 2-day demo.

---

## Design Decisions

1. **localStorage over a JSON file** — simpler for a browser-only demo; no server route needed.
2. **Functional manager pattern** — pure functions are trivially testable and avoid shared mutable state.
3. **`ManagerResult<T>` discriminated union** — explicit error cases prevent silent failures; callers must handle `NOT_FOUND` and `STALE_UPDATE`.
4. **`expectedUpdatedAt` for stale-update detection** — lightweight optimistic concurrency without a version counter; works correctly for single-user localStorage.
5. **UUID v4 via `crypto.randomUUID()`** — available in modern browsers and Node 19+; no extra dependency.
6. **No external state library** — React `useState` is sufficient at this scale; avoid complexity.
7. **Tailwind CSS** — utility classes keep styling co-located with components and require no CSS modules.
