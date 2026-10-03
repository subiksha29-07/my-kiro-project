---
inclusion: always
---

# Project Architecture

## Overview

This is a **Smart Expense Tracker** web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. It runs locally with `npm run dev` and uses `localStorage` for persistence.

## Directory Structure

```
smart-expense-tracker/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Dashboard (home page)
│   └── transactions/
│       └── page.tsx            # Transaction list + CRUD page
├── components/                 # React UI components
│   ├── dashboard/
│   │   ├── SummaryCard.tsx
│   │   ├── BalanceSummary.tsx
│   │   └── EmptyState.tsx
│   ├── transactions/
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── TransactionFilter.tsx
│   │   └── DeleteConfirmDialog.tsx
│   └── budget/
│       ├── BudgetWidget.tsx
│       ├── BudgetForm.tsx
│       └── BudgetProgressBar.tsx
├── lib/                        # Business logic and persistence (no React)
│   ├── transactions/
│   │   ├── types.ts            # Shared TypeScript types
│   │   ├── constants.ts        # Predefined categories
│   │   ├── validator.ts        # Pure validation functions
│   │   ├── manager.ts          # Pure CRUD/filter functions
│   │   └── store.ts            # localStorage persistence
│   ├── dashboard/
│   │   └── calculator.ts       # Pure balance calculation
│   ├── budget/
│   │   ├── manager.ts          # Pure budget evaluation
│   │   └── store.ts            # localStorage persistence for budget
│   └── utils/
│       └── currency.ts         # formatCurrency() utility
├── __tests__/                  # All tests mirror the lib/ structure
│   ├── transactions/
│   │   ├── validator.test.ts
│   │   ├── manager.test.ts
│   │   ├── store.test.ts
│   │   └── manager.pbt.ts      # Property-based tests
│   ├── dashboard/
│   │   ├── calculator.test.ts
│   │   └── calculator.pbt.ts
│   └── budget/
│       ├── manager.test.ts
│       └── manager.pbt.ts
├── .kiro/
│   ├── specs/                  # Feature specs
│   ├── steering/               # These steering documents
│   └── hooks/                  # Automation hooks
└── vitest.config.ts
```

## Layer Rules

1. **`lib/`** — pure TypeScript only. No React, no JSX, no browser globals except `localStorage` in `*.store.ts` files.
2. **`components/`** — React components only. All are `'use client'`. Do not call `localStorage` directly; go through `lib/*/store.ts`.
3. **`app/`** — page components. Orchestrate state and wire components to lib functions. Load/save via store on mount and after mutations.
4. **`__tests__/`** — mirrors `lib/`. Test files live next to what they test conceptually, not inside `lib/`.

## Dependency Direction

```
app/* → components/* → lib/* → (no further imports)
                     ↑
              __tests__/*
```

Components import from `lib/`. Pages import from both `components/` and `lib/`. Nothing in `lib/` imports from `components/` or `app/`.

## localStorage Keys

| Key | Purpose |
|---|---|
| `smart-expense-tracker-transactions` | All transactions as a JSON array |
| `smart-expense-tracker-budget` | Monthly budget as a numeric string |
