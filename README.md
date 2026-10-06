# Smart Expense Tracker

> A fully client-side personal finance web application built with Next.js 14, TypeScript, and Tailwind CSS.  
> No backend. No account required. All data stays in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-1-6e9f18?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

Smart Expense Tracker is a personal finance application that lets you record income and expense transactions, monitor your current balance, and track monthly spending against a self-defined budget — all without any server, database, or login.

Every piece of data is stored in the browser's `localStorage` and remains private to your device. The application is built on Next.js 14 with the App Router, written entirely in TypeScript, and styled with Tailwind CSS.

The project was developed as a **Kiro University** showcase, applying spec-driven development, property-based testing, AI steering documents, automation hooks, a custom Power, an MCP server, and a custom agent — all within a single cohesive codebase.

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Dashboard Features](#dashboard-features)
- [Transaction Management](#transaction-management)
- [Category Management](#category-management)
- [Testing Approach](#testing-approach)
- [Project Architecture](#project-architecture)
- [Kiro Workflow](#kiro-workflow)
- [Kiro Hooks](#kiro-hooks)
- [Kiro Powers](#kiro-powers)
- [MCP Configuration](#mcp-configuration)
- [Custom Agent](#custom-agent)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Folder Structure](#folder-structure)

---

## Screenshots

### Dashboard
![Dashboard — summary cards and budget widget](public/screenshots/dashboard.png)

*Real-time summary cards showing Total Income, Total Expenses, and Current Balance. Budget progress bar and Quick Actions panel.*

### Transaction List
![Transaction list with entries](public/screenshots/transaction-list.png)

*All transactions listed with type indicator, category badge, date, and amount. Filter dropdowns for Type and Category.*

### Add Transaction Form
![Add Transaction form](public/screenshots/add-transaction.png)

*Form for adding a new transaction with type, amount, date, title, category, and optional description fields.*

### Category Manager
![Category Manager modal](public/screenshots/category-manager.png)

*Modal for managing custom expense and income categories. Changes apply to the transaction form and filter dropdowns.*

---

## Features

The Smart Expense Tracker implements the following core features:

- **Dashboard** — real-time summary of total income, total expenses, and current balance
- **Monthly Budget** — set a spending limit and track progress with a visual bar
- **Transaction Management** — add, edit, delete, filter, and sort income and expense records
- **Category Management** — create and remove custom categories for both income and expenses
- **Data Persistence** — all data is saved to `localStorage` and survives page refreshes
- **Empty State Handling** — the dashboard shows a clear call-to-action when no transactions exist
- **Delete Confirmation** — a confirmation dialog prevents accidental transaction deletion
- **Stale-Update Protection** — optimistic concurrency prevents silent overwrites during edits

---

## Dashboard Features

The dashboard (`app/(app)/dashboard/page.tsx`) displays a live summary of the user's financial data using the following widgets:

### 💰 Total Income
Calculated by summing the `amount` of all transactions with `type: 'INCOME'`. Displayed in a green summary card. Updates immediately when income transactions are added, edited, or deleted.

### 💸 Total Expenses
Calculated by summing the `amount` of all transactions with `type: 'EXPENSE'`. Displayed in a red summary card. Aggregates all expense entries regardless of category or date.

### 📈 Current Balance
Computed as `totalIncome - totalExpenses`. Displayed in a blue summary card. Shows a negative value (in red) when expenses exceed income.

### 🎯 Monthly Budget
A user-defined spending limit for the current month. Stored in `localStorage`. The budget widget shows:
- The budget amount set by the user
- This month's total expenses
- Remaining budget (or overspend amount)
- A visual progress bar that shifts **green → amber → red** as spending approaches and exceeds the limit
- Status label: `Within Budget` or `Over Budget`

### 📅 This Month's Expenses
Computed by `computeMonthlyExpenses()` in `lib/budget/manager.ts`. Only counts `EXPENSE` transactions whose `date` field falls within the current calendar month (`YYYY-MM` prefix match). This value drives the budget progress bar.

---

## Transaction Management

Transactions are managed on the Transactions page (`app/(app)/transactions/page.tsx`) and through the components in `components/transactions/`.

### Adding a Transaction
Click **+ Add Transaction** to open the form (`TransactionForm.tsx`). Required fields:
- **Type** — `Income` or `Expense`
- **Amount** — positive number, max 2 decimal places, max $999,999,999.99
- **Date** — `YYYY-MM-DD` format, valid calendar date between 1900 and 2100
- **Title** — 1–100 characters
- **Category** — selected from the available list for the chosen type

Optional field: **Description** (max 500 characters).

All validation is handled by pure functions in `lib/transactions/validator.ts`. All errors are reported together — the form never short-circuits on the first failure.

### Editing a Transaction
Click the edit icon on any transaction row to re-open the form pre-filled with existing values. The `id` field is immutable and is never changed during an edit. Stale-update protection (`updatedAt` check) prevents silent overwrites if another edit happened in the meantime.

### Deleting a Transaction
Click the delete icon on a row. A confirmation dialog (`DeleteConfirmDialog.tsx`) appears to prevent accidental deletion. On confirmation, the transaction is removed and all summaries update immediately.

### Filtering Transactions
Two dropdowns at the top of the list (`TransactionFilter.tsx`) allow filtering by:
- **Type** — All Types / Income / Expense
- **Category** — All Categories / any specific category present in the current list

Filters are applied client-side and do not affect persisted data.

### Sorting
Transactions are always displayed sorted by **date descending** (newest first), with `createdAt` as a secondary sort key for transactions on the same date. This sort order is enforced by `lib/transactions/manager.ts`.

### Persistence
All transactions are saved to `localStorage` under the key `smart-expense-tracker-transactions` as a JSON array. Data persists across page refreshes and browser restarts.

---

## Category Management

Categories are used to classify each transaction. The project ships with a set of built-in categories defined in `lib/transactions/constants.ts`:

**Built-in Income categories:** Salary, Freelance, Investment, Gift, Other Income

**Built-in Expense categories:** Food, Transport, Housing, Healthcare, Entertainment, Education, Shopping, Other Expense

### Custom Categories
Users can create their own categories using the **Category Manager** (`components/settings/CategoryManager.tsx`), accessible via the Categories button on the Transactions page. The modal provides:
- A text input (comma-separated) to add multiple categories at once
- Separate tabs for Expense and Income category lists
- Tag-style chips showing the current categories
- A **Save Categories** button that applies changes immediately

Custom categories are stored in `localStorage` under the key `smart-expense-tracker-categories`. Once saved, they appear in both the transaction form's category dropdown and the filter dropdown on the Transactions page.

### Removing a Category
Categories can be removed from the Category Manager. Removing a category does not retroactively change existing transactions that used it — it only removes the option from future selections.

---

## Testing Approach

The project uses [Vitest](https://vitest.dev/) as the test runner and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for component tests. Tests are located in `__tests__/` and mirror the `lib/` and `components/` structure.

### Test Types

**Unit tests** — test pure functions in `lib/` directly, covering validation logic, CRUD operations, currency formatting, and budget calculations.

**Component tests** — render React components in a jsdom environment and assert on rendered output and user interactions.

**Property-based tests (PBT)** — use [fast-check](https://fast-check.dev/) to generate hundreds of random inputs and verify that mathematical invariants hold across all of them. PBT files are named `*.pbt.ts`.

### Property-Based Tests

There are **22 properties** across three suites:

**`__tests__/transactions/manager.pbt.ts`** (8 properties)
- `balance === totalIncome - totalExpenses` for any transaction list
- `validateTransaction` always passes for generated valid inputs
- `getTransactions` result is always a subset of the store
- Adding an EXPENSE increases total expenses by exactly that amount
- Deleting a transaction reduces store length by exactly 1
- Sort order is always date desc, then `createdAt` desc
- `saveTransactions` → `loadTransactions` round-trip returns the same list
- `updateTransaction` never changes a transaction's `id`

**`__tests__/dashboard/calculator.pbt.ts`** (7 properties)
- `balance === totalIncome - totalExpenses` within floating-point tolerance
- `totalIncome >= 0` and `totalExpenses >= 0` for any list
- Adding one INCOME of amount `a` → `newBalance === oldBalance + a`
- Adding one EXPENSE of amount `a` → `newBalance === oldBalance - a`
- Shuffling the list does not change income, expenses, or balance
- `calculateSummary([])` always returns all zeros

**`__tests__/budget/manager.pbt.ts`** (7 properties)
- `monthlyExpenses >= 0` for any list and any month
- `WITHIN_BUDGET` iff `monthlyExpenses <= budget`
- `remaining` is non-negative when within budget
- `overspend` is non-negative when over budget
- `percentage` is between 0 and its uncapped value; visual fill is capped at 100
- Adding an EXPENSE in a month increases that month's total by exactly that amount
- Transactions outside the target month contribute nothing to monthly expenses

### Shared Arbitraries

Reusable fast-check generators are defined in `__tests__/arbitraries.ts` and imported by all PBT files.

---

## Project Architecture

The codebase is divided into three main layers with a strict one-way dependency rule:

```
app/*  →  components/*  →  lib/*
                ↑
          __tests__/*
```

### `app/`
Next.js App Router pages and layouts. Contains the landing page, the app shell layout, the dashboard page, and the transactions page. Pages are thin — they compose components and pass data down.

### `components/`
React client components (`'use client'`). Grouped by feature: `auth/`, `budget/`, `dashboard/`, `layout/`, `settings/`, `transactions/`. Components read from and write to `lib/` — they never access `localStorage` directly.

### `lib/`
Pure TypeScript business logic with no React dependencies. Divided into:
- `lib/transactions/` — types, validation, CRUD manager, localStorage store, constants
- `lib/dashboard/` — `calculateSummary()` pure function
- `lib/budget/` — `evaluateBudget()`, `computeMonthlyExpenses()`, localStorage store
- `lib/categories/` — localStorage store for custom categories
- `lib/utils/` — `formatCurrency()` utility

Because `lib/` has no React dependency, every function in it is directly unit-testable without mounting a component.

### `__tests__/`
Test files mirror the `lib/` and `components/` structure. Includes unit tests, component tests, and property-based tests (`*.pbt.ts`). Shared fast-check arbitraries live in `__tests__/arbitraries.ts`.

### `.kiro/`
Kiro configuration artefacts: specs, steering documents, hooks, powers, agent definitions, and MCP settings. Does not affect runtime behaviour.

---

## Kiro Workflow

This project was built using [Kiro](https://kiro.dev)'s spec-driven, AI-assisted development workflow. All workflow artefacts are stored in the `.kiro/` directory.

### Specs

Each major feature was designed as a **Kiro Spec** before any implementation began. A spec consists of three files:

| File | Purpose |
|---|---|
| `requirements.md` | User stories and EARS-format acceptance criteria |
| `design.md` | Technical design: data models, component breakdown, function signatures |
| `tasks.md` | Ordered implementation tasks with dependencies |

Specs exist for three features:

- `.kiro/specs/transaction-management/` — full CRUD for income and expense transactions
- `.kiro/specs/dashboard-balance/` — real-time summary cards and balance calculation
- `.kiro/specs/monthly-budget/` — budget setting, monthly expense tracking, progress bar

### Steering Documents

Four **steering documents** in `.kiro/steering/` are loaded by Kiro at the start of every session and guide all code generation decisions:

| File | Governs |
|---|---|
| `project-architecture.md` | Layer separation, dependency direction, naming conventions |
| `coding-conventions.md` | TypeScript patterns, error handling, immutability rules |
| `testing-conventions.md` | Test structure, PBT patterns, assertion style |
| `ui-conventions.md` | Tailwind usage, component structure, accessibility requirements |

Steering documents ensure Kiro follows the same conventions consistently across every session without needing to re-explain them.
