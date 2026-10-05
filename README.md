# Smart Expense Tracker

A personal finance web application for tracking income and expenses, monitoring account balance, and managing a monthly budget. Built with Next.js 14, TypeScript, and Tailwind CSS — no backend required.

---

## Features

### Transaction Management
- Add, edit, and delete transactions with a validated form
- Filter by type (Income / Expense) and category
- Transactions persist across sessions via `localStorage`
- Stale-update protection (optimistic concurrency) prevents overwriting in-flight edits
- Delete confirmation dialog to prevent accidental removal

### Dashboard & Balance
- Real-time summary cards showing total income, total expenses, and current balance
- Loading states during data hydration
- Empty state with a call-to-action when no transactions exist

### Monthly Budget
- Set a monthly spending budget
- Visual progress bar that turns green → amber → red as spending increases
- Three budget states: `WITHIN_BUDGET`, `OVER_BUDGET`, `NO_BUDGET`

---

## Architecture

```
smart-expense-tracker/
├── app/
│   ├── layout.tsx                   # Root layout with sticky navbar
│   ├── page.tsx                     # Dashboard (home page)
│   └── transactions/
│       └── page.tsx                 # Transactions CRUD page
├── components/
│   ├── dashboard/
│   │   ├── SummaryCard.tsx          # Individual metric card
│   │   ├── BalanceSummary.tsx       # Grid of 3 summary cards
│   │   └── EmptyState.tsx           # CTA when no transactions exist
│   ├── transactions/
│   │   ├── TransactionForm.tsx      # Add/edit form with validation
│   │   ├── TransactionList.tsx      # List with empty states
│   │   ├── TransactionItem.tsx      # Individual transaction row
│   │   ├── TransactionFilter.tsx    # Type + category filter dropdowns
│   │   └── DeleteConfirmDialog.tsx  # Confirmation modal
│   └── budget/
│       ├── BudgetWidget.tsx         # Complete budget status display
│       ├── BudgetForm.tsx           # Budget input form
│       └── BudgetProgressBar.tsx    # Visual progress indicator
├── lib/
│   ├── transactions/
│   │   ├── types.ts                 # Shared TypeScript interfaces
│   │   ├── constants.ts             # Predefined category lists
│   │   ├── validator.ts             # Pure validation functions
│   │   ├── manager.ts               # Pure CRUD and filter functions
│   │   └── store.ts                 # localStorage persistence
│   ├── dashboard/
│   │   └── calculator.ts            # calculateSummary (pure)
│   ├── budget/
│   │   ├── manager.ts               # evaluateBudget, computeMonthlyExpenses
│   │   └── store.ts                 # localStorage persistence for budget
│   └── utils/
│       └── currency.ts              # formatCurrency utility
├── __tests__/
│   ├── arbitraries.ts               # Shared fast-check generators
│   ├── transactions/                # 8 PBTs + unit + store tests
│   ├── dashboard/                   # 7 PBTs + unit + component tests
│   ├── budget/                      # 7 PBTs + unit + store tests
│   ├── components/                  # Component tests (5 files)
│   └── utils/                       # Currency utility tests
└── .kiro/
    ├── specs/                       # Feature specs (requirements, design, tasks)
    ├── steering/                    # Persistent coding conventions
    ├── hooks/                       # Automation hooks
    ├── powers/                      # Custom Kiro powers
    └── agents/                      # Custom agent definitions
```

### Dependency Direction

```
app/* → components/* → lib/*
              ↑
        __tests__/*
```

`lib/` is pure TypeScript — no React, no JSX. Nothing in `lib/` imports from `components/` or `app/`.

---

## Technologies

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Testing | Vitest 1 + @testing-library/react |
| Property testing | fast-check 4 |
| Persistence | Browser `localStorage` |
| Runtime | Node.js (no backend / no database) |

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

---

## Testing

### Run all tests

```bash
npm run test
```

Runs all 240 tests (unit, component, and property-based) once and exits.

### Watch mode

```bash
npm run test:watch
```

### Coverage report

```bash
npm run test:coverage
```

### TypeScript validation (no emit)

```bash
npx tsc --noEmit
```

### Test counts by category

| Suite | Files | Tests |
|---|---|---|
| `__tests__/transactions/` | validator, manager, store, PBT | ~80 |
| `__tests__/dashboard/` | calculator, SummaryCard, PBT | ~50 |
| `__tests__/budget/` | manager, store, PBT | ~60 |
| `__tests__/components/` | 5 component files | ~40 |
| `__tests__/utils/` | currency | ~10 |
| **Total** | | **240** |

---

## Property-Based Testing

Property-based testing (PBT) automatically generates hundreds of random inputs and checks that mathematical invariants hold across all of them — not just the examples a developer thought to write.

This project uses [fast-check](https://fast-check.dev/) for PBT. There are 22 properties spread across three suites:

### `__tests__/transactions/manager.pbt.ts` — 8 properties

1. Balance invariant: `balance === totalIncome - totalExpenses` for any transaction list
2. Amount non-negative: `validateTransaction` always passes for generated valid inputs
3. Filter subset: `getTransactions` never introduces transactions not in the store
4. Add increases total expenses: adding an EXPENSE increases the sum by exactly that amount
5. Delete decreases count: deleting an existing transaction reduces store length by exactly 1
6. Sort stability: results are always sorted by date desc, then `createdAt` desc
7. Round-trip persistence: `saveTransactions` → `loadTransactions` returns the same list
8. Edit preserves ID: `updateTransaction` never changes a transaction's `id`

### `__tests__/dashboard/calculator.pbt.ts` — 7 properties

1. `balance === totalIncome - totalExpenses` within floating-point tolerance
2. `totalIncome >= 0` for any list
3. `totalExpenses >= 0` for any list
4. Adding one INCOME of amount `a` → `newBalance === oldBalance + a`
5. Adding one EXPENSE of amount `a` → `newBalance === oldBalance - a`
6. Shuffling the list does not change income, expenses, or balance
7. `calculateSummary([])` always returns all zeros

### `__tests__/budget/manager.pbt.ts` — 7 properties

1. `monthlyExpenses >= 0` for any list and any month
2. `status === WITHIN_BUDGET` iff `monthlyExpenses <= budget`
3. `remaining` is non-negative when status is `WITHIN_BUDGET`
4. `overspend` is non-negative when status is `OVER_BUDGET`
5. `percentage >= 0` and the visual fill `Math.min(percentage, 100) <= 100`
6. Adding an EXPENSE in a month increases that month's total by exactly that amount
7. Transactions with dates outside the target month contribute nothing to monthly expenses

### Running PBT tests only

```bash
npm run test -- --reporter=verbose manager.pbt
```

Each property runs 100 generated cases. When a property fails, fast-check shrinks the input to the smallest counterexample and prints it.

---

## Kiro Workflow

This project was built using Kiro's spec-driven, AI-assisted workflow. The `.kiro/` directory contains all the artefacts from that process.

### Kiro University — 7 Lesson Mapping

| Lesson | Implementation | Evidence |
|---|---|---|
| **1. Spec-driven development** | All three features were designed as Kiro specs before implementation: requirements → design → tasks | `.kiro/specs/transaction-management/`, `.kiro/specs/dashboard-balance/`, `.kiro/specs/monthly-budget/` — each with `requirements.md`, `design.md`, `tasks.md` |
| **2. Steering documents** | Four always-loaded steering docs define coding conventions, architecture rules, testing patterns, and UI guidelines that Kiro follows in every session | `.kiro/steering/project-architecture.md`, `coding-conventions.md`, `testing-conventions.md`, `ui-conventions.md` |
| **3. Hooks** | Two file-watch hooks automate quality gates on every save | `.kiro/hooks/run-tests-on-lib-change.kiro.hook` — runs `npm run test` on changes to `lib/` or `__tests__/`; `typecheck-on-change.kiro.hook` — runs `npx tsc --noEmit` on changes to `lib/`, `components/`, or `app/` |
| **4. Property-based testing** | 22 fast-check properties across three PBT suites verify mathematical invariants of the core business logic | `__tests__/transactions/manager.pbt.ts` (8), `__tests__/dashboard/calculator.pbt.ts` (7), `__tests__/budget/manager.pbt.ts` (7) |
| **5. Powers** | A custom `expense-validator` power bundles three steering guides for working with PBT in this project | `.kiro/powers/expense-validator/POWER.md` + steering guides: `running-pbt-tests.md`, `writing-new-properties.md`, `regression-from-counterexample.md` |
| **6. MCP** | A credential-free local filesystem MCP server gives Kiro structured read/write access to the project directory during code review and development sessions | `.kiro/settings.json` configures `@modelcontextprotocol/server-filesystem` scoped to the project root |
| **7. Custom agents** | An Expense Review Agent audits transaction data against all 6 validation rules, detects 8 suspicious patterns, and evaluates budget impact — read-only by default | `.kiro/agents/expense-review-agent.md` |

---

## Demo Flow

Follow these steps to explore all three features end to end.

1. **Start the app** — run `npm run dev` and open [http://localhost:3000](http://localhost:3000)
2. **Empty state** — the dashboard shows the empty state CTA because there are no transactions yet
3. **Add income** — navigate to Transactions → click "Add Transaction" → set type to Income, category Salary, enter an amount and date → save
4. **Add expenses** — add two or three Expense transactions (e.g., Food, Transport) with different dates
5. **Check the dashboard** — go back to the home page; the three summary cards now show total income, total expenses, and balance
6. **Filter transactions** — on the Transactions page, use the Type and Category dropdowns to filter the list
7. **Edit a transaction** — click the edit icon on any row, change the amount, and save; observe the dashboard balance update
8. **Set a budget** — on the dashboard, find the Budget widget and set a monthly budget
9. **Watch the progress bar** — add more expenses for the current month; the bar moves green → amber → red as you approach or exceed the budget
10. **Delete a transaction** — click the delete icon, confirm in the dialog; the summaries and budget update instantly
11. **Reload the page** — all data persists because it is stored in `localStorage`

---

## localStorage Keys

| Key | Purpose |
|---|---|
| `smart-expense-tracker-transactions` | All transactions as a JSON array |
| `smart-expense-tracker-budget` | Monthly budget as a numeric string |

---

## Project Structure Notes

- `lib/` is pure TypeScript — no React, no JSX, no browser globals except `localStorage` in `*.store.ts` files
- All components use `'use client'` and load/save exclusively through `lib/*/store.ts`
- `__tests__/` mirrors the `lib/` structure; test files live alongside their logical counterpart, not inside `lib/`
- Currency amounts are always displayed in USD with exactly 2 decimal places (`$1,234.56`); negative balances use the Unicode minus sign (`−$123.45`), not an ASCII hyphen
